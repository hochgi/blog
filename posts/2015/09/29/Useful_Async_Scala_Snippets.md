Scala makes it easy to work asynchronously with futures.
After some time working with scala async constructs, we've seen some repetitive patterns.
So here's a few snippets that may be useful for others:

* **select** - selecting the first future that completes, if there are multiple already completed futures, selects one of those.
given a collection of futures, returns a _Future[(Try[T],Coll[Future[T]])]_, or in words: a Future of tuple of the first completed future's _Try_ and the collection of the rest of the futures.
```scala
def select[T,Coll](fc: Coll)
          (implicit ec: ExecutionContext, 
           ev: Coll <:< TraversableLike[Future[T],Coll]): Future[(Try[T],Coll)] = {
  if (fc.isEmpty)
    Future.failed(new IllegalArgumentException("select from empty collection"))
  else {
    val p = Promise[(Try[T], Future[T])]()
    fc.foreach { f =>
      f.onComplete { t =>
        if (!p.isCompleted)
          p.trySuccess(t -> f)
      }
    }
    p.future.map {
      case (t, f) =>
        t -> fc.filter(_ != f)
    }
  }
}
```
_sidenote: there is a similar gist by [@viktorklang](https://twitter.com/viktorklang) which inspired this snippet (difference is on the collection return type). you can find it [here](https://gist.github.com/viktorklang/4488970)_

* **successes** - given a sequence of futures, return a future of a sequence containing all the futures that succeeded.
one of the most frequently used _Future_'s methods in our code base, is _Future.sequence_. but sometimes, you'll need a "softer" method, that will collect all the succeeding futures' elements, and won't fail if a few futures failed.
```scala
def successes[A, M[X] <: Traversable[X]](in: M[Future[A]])
             (implicit ec: ExecutionContext, 
              cbf: CanBuildFrom[M[Future[A]], A, M[A]]): Future[M[A]] = {
  in.foldLeft(Future.successful(cbf(in))) {
    (fr, fa) => {
      fa.flatMap(a => fr.map(_ += a)(ec))(ec).recoverWith{case _: Throwable => fr}(ec)
    }
  }.map(_.result())
}
```
_sidenote: this is almost the same as Future.sequence method. (check the scala source code)_

* **stream** - being async is great, but also being lazy. sometime, you'll want to convert part of your logic to use a regular collections instead of collections containing futures (you'll need a really good reason to do so). to do this efficiently, you'll want to convert a sequence of futures to a _Stream_, where each element in the stream is given as soon as it's corresponding future completes. i.e: sort a collection of futures by they're completion time. so here's how to do async → lazy conversion:
```scala
def stream[T,Coll](fc: Coll, timeout: FiniteDuration)
                  (implicit ec: ExecutionContext, 
                   ev: Coll <:< TraversableLike[Future[T],Coll]): Stream[Try[T]] = {
  if (fc.isEmpty) Stream.empty[Try[T]]
  else try {
    Await.result(select(fc).map {
      case (t, coll) => t #:: stream(coll, timeout)
    }, timeout)
  }
  catch {
    case e: TimeoutException => Stream(Failure[T](e))
  }
}
```

* **retry** - ~~sometime, you'll deal with futures that may fail, and you'll want to retry whatever task that created the future in the first place, with an optional delay between retries. here's a simple way to do it:~~
The old snippets had many flaws. please refer to the [following blog post](/2016/03/async-scheduling-retrying-revised.html) to compare the version given here, with the new improved version. 

* **travector** - The following is a tweak of Future.traverse. In our code, we wanted to improve performance, and decided to use internally in Vector instead of the more general seq (defaults to List). Vector is better for cache locality, and perform better with concatenations or appending to the end. So, we had in many places methods that take a Seq[Something], and return Future[Seq[SomethingElse]]. behind the scenes, it was Future.traverse that did the work. And now, we replaced it with: travector!

```scala
/** 
 * Transforms a `TraversableOnce[A]` into a `Future[Vector[B]]` 
 * using the provided function `A => Future[B]`.
 * This is useful for performing a parallel map. 
 * For example, to apply a function to all items of a list in parallel:
 *
 * {{{
 *   val myFutureVector = Future.travector(myList)(x => Future(myFunc(x)))
 * }}}
 *
 * This is the same as `Future.traverse`,
 * but it will always yield a vector, 
 * regardless of the provided collection type.
 */
def travector[A, B, M[X] <: TraversableOnce[X]]
             (in: M[A])
             (fn: A => Future[B])
             (implicit ec: ExecutionContext): Future[Vector[B]] =
  in.foldLeft(Future.successful(Vector.newBuilder[B])) { (fr, a) =>
    val fb = fn(a)
    for (r <- fr; b <- fb) yield (r += b)
  }.map(_.result())
``` 

The code is pretty much copied from Future.traverse (check & compare), but this simple little trick gained us some perf boost.
