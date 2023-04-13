In my previous blog post, [useful async scala snippets](/2015/09/useful-async-scala-snippets.html), I described a way to retry an asynchronous task that may fail. The code Iv'e suggested was:

```scala
def retry[T](maxRetries: Int, waitBetweenRetries: Option[FiniteDuration] = None)
            (task: =>Future[T])
            (implicit ec: ExecutionContext): Future[T] = {
  require(maxRetries > 0, "maxRetries must be positive")
  if(maxRetries > 1) task.recoverWith{
    case t: Throwable => waitBetweenRetries match {
      case None => retry(maxRetries - 1)(task)
      case Some(waitTime) => Future[Unit]{
        try {
          Await.ready(Promise().future, waitTime)
        }
        catch {
          case _: TimeoutException => ()
        }
      }.flatMap(_ => retry(maxRetries - 1, waitBetweenRetries)(task))
    }
  } else task
}
```

Now, I want to suggest a better alternative. So, what's wrong with this first solution? well, let's start with showing the alternate suggestion, and compare the 2 snippets:

Firstly, we need to get a hold of some simple scheduler. If you have akka's `ActorSystem` available, then you can use `system.scheduler.scheduleOnce`. If not, let's write simple (somewhat naïve) implementation:

```scala
object SimpleScheduler {
  // if we never schedule a job, we shouldn't waste the resources. 
  // So let's define our thread pool lazily.
  private[this] lazy val timer = java.util.concurrent.Executors.newScheduledThreadPool(1)

  def schedule[T](duration: FiniteDuration)
                 (body: => T)
                 (implicit executionContext: ExecutionContext): Future[T] = {
    val p = Promise[T]()
    timer.schedule(new Runnable {
      override def run(): Unit = {
        // body may be expensive to compute, 
        // and must not be run in our only timer thread expense,
        // so we compute the task inside a `Future`,
        // and make it run on the expense of the given executionContext.
        p.completeWith(Future(body)(executionContext))
      }
    },duration.toMillis,java.util.concurrent.TimeUnit.MILLISECONDS)
    p.future
  }

  // The given `body` must not do any work on current thread. 
  // We have no way to enforce it,
  // but we must be careful not do pass a task that looks something like:
  // {{{
  //   val result: Result = doSomethingRealyExpensive()
  //   Future.successful(result)
  // }}}
  // remember we only have a single Thread to schedule all tasks.
  def scheduleFuture[T](duration: FiniteDuration)
                       (body: => Future[T]): Future[T] = {
    val p = Promise[T]()
    timer.schedule(new Runnable {
      override def run(): Unit = p.completeWith(body)
    },duration.toMillis,java.util.concurrent.TimeUnit.MILLISECONDS)
    p.future
  }
}
```

OK, so now we have our scheduler set up, and we can write our retry function:

```scala
/**
 * @param maxRetries max numbers to retry the task
 * @param delay "cool-down" wait period
 * @param task the task to run
 */
def retry[T](maxRetries: Int, delay: FiniteDuration = Duration.Zero)
            (task: => Future[T])
            (implicit ec: ExecutionContext): Future[T] = {
  require(maxRetries > 0, "maxRetries must be positive")
  require(delay >= Duration.Zero, "delay must be non-negative")
  if (maxRetries == 1) task
  else task.recoverWith {
    case _: Throwable =>
      if(delay == Duration.Zero) retry(maxRetries - 1)(task)
      else SimpleScheduler.scheduleFuture(delay)(retry(maxRetries - 1)(task))
  }
}
```

So what makes this implementation better?
besides a minor API change (taking a `FiniteDuration` without unnecessary boxing of it in an `Option`). we have less threads contexts switches, and overall this is more efficient. In the first implementation we used:

```scala
Future[Unit]{
  try {
    Await.ready(Promise().future, ...
``` 

If we'll count the number of "tasks" to execute at the expense of the given `ExecutionContext`, we'll see that we have the first `Future.apply`, and inside it's body, we call `Await.ready`, which uses `blocking{...}` behind the scenes, which means we allow the `ExecutionContext` to allocate an extra thread if needed, but all of these only to wait for a future which will never complete, and throw an `Exception`, and what we really need is only the time-out, so we can try the original given task again. A lot of unneeded work, and threads context-switch with the possibility to cause the allocation of a new thread.

Now, let's examine the revised implementation. we already have a thread to handle the execution when it is scheduled. we're just scheduling a task it should run. the only "extra" work we are doing, is creating a new `Runnable`, which when run, will complete a promise with the task's output.

One thing we must pay attention to, is that we must not perform any work at the expense of the scheduling thread. This thread should be available for other scheduling tasks. Note that I also added a regular scheduling method, in which the given (synchronous) task is wrapped inside a `Future{...}` block. this is to make sure the task is run at the expense of the given (implicitly) `ExecutionContext`, and not on the scheduling thread. 
