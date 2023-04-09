# How we utilize Akka streams in CM-Well
Unfolding is not a new concept, and this blog post isn't about explaining a [needlessly obfuscated ivory tower FP term](https://en.wikipedia.org/wiki/Anamorphism). This post is about how a simple concept, of building a sequence from an initial state, and a function that generated a tuple of the next state, and an element, is used in [CM-Well](https://github.com/thomsonreuters/CM-Well).

## How our story begins
Initially, CM-Well didn't have streaming APIs. The closest thing our users could get, was [`iterator` API](https://github.com/thomsonreuters/CM-Well/blob/4f703b5b45345cc463f4b822a1d6466e7e72944a/server/cmwell-docs/cmwell-infodocs/Tutorial.HandsOnExercises.StreamWithIterator.md). There's not much in this API regarding CM-Well's logic, we just wrap [Elasticsearch scroll API](https://www.elastic.co/guide/en/elasticsearch/guide/1.x/scan-scroll.html#scan-scroll), with or without enriching the results by fetching data from Cassandra. We also use a little trick of storing the `scrollId` received from Elasticsearch in a short lived actor, and return the actor address instead, and while doing so, ensuring that the iterator id token isn't "long".
We did this, to allow users to always use GET with a query parameter, what isn't possible with Elasticsearch's original `scrollId`, since it may not fit in a URL (> 4K).

Well, of course, users who used it, just wanted to get all the data.
There really isn't much point in having users do a request for every chunk.
We wanted to just provide a streaming chunked response with all the data.

## The story unfolds
The concept of `unfold` isn't just about streams, as can be seen in [CM-Well's util](https://github.com/thomsonreuters/CM-Well/blob/4f703b5b45345cc463f4b822a1d6466e7e72944a/server/cmwell-util/src/main/scala/cmwell/util/collections/package.scala#L266-L423), we also implemented it for regular collections[^footnote1]. But using it to unfold streams of data is a natural fit. Elasticsearch scroll API, makes a great example for how unfolding streams of data gets simple using `unfold`. We have the state (scrollId), and element (scroll results). So, we experimented with [RX](http://reactivex.io/rxscala), Akka streams (which was very young, and experimental back then), and [play's iteratees](https://www.playframework.com/documentation/2.5.x/Iteratees#Iteratees). Trying to see which will unfold our data stream best.

We ended up with a fairly reasonable implementation with play's iteratees.
After all, the webservice was built with play, and at the time (play 2.3), we had to convert to iteratees anyway.
Personally, I liked the concept, and hated the DSL[^footnote2]. But I do think one of the biggest drawbacks of iteratees,
is that it perceives as "too complicated" for newbies. And it does have a steep leaning curve.
Anyway, it served us pretty well, but as akka streams kept evolving, I began to squint back in it's direction.

## The akka-stream chapter
My initial go at unfolding a stream with akka streams was a low level implementation of a publisher actor (I even have an [old gist of that implementation](https://gist.github.com/hochgi/cbe5ffc6cf2915e31091#file-akkastreamunfold-scala)).
It worked, but felt not very "akka-streamy", and too low level.
So I decided to try and submit [my first PR to akka](https://github.com/akka/akka/pull/19143), and add unfold to official API.
This initial PR, even show you can unfold an infinite stream with what akka had back then ([`unfoldInf`](https://github.com/akka/akka/blob/4799b7736cb37de588b85661a546c47a62979d60/akka-stream/src/main/scala/akka/stream/scaladsl/Source.scala#L276-L298) was later removed, as it really didn't add much value...).
but unfolding finite and async streams, had to be taken care of in a custom `GraphStage`. Basically, I shamelessly copied play's iteratees API, and implemented it in akka streams.
I even named the methods `unfold` & `unfoldM` for the async version at first, following the iteratees convention (as can be seen in the [original issue](https://github.com/akka/akka/issues/19021)).
Back to CM-Well, we used `unfoldAsync` to create a new API. The resulting [`stream` API](https://github.com/thomsonreuters/CM-Well/blob/4f703b5b45345cc463f4b822a1d6466e7e72944a/server/cmwell-docs/cmwell-infodocs/API.Stream.StreamInfotons.md) is pretty useful, and provides a simple way for users to downloads a complete dataset, with a single `curl`/`wget` command.

Time went by, CM-Well kept evolving, and we started using akka-stream more and more.
Many parts of CM-Well, act as clients for the webservice. e.g: [cmwell-dc](https://github.com/thomsonreuters/CM-Well/tree/4f703b5b45345cc463f4b822a1d6466e7e72944a/server/cmwell-dc), which is responsible (among other things) to inter data center synchronization.
Or [cmwell-data-tools](https://github.com/thomsonreuters/CM-Well/tree/4f703b5b45345cc463f4b822a1d6466e7e72944a/server/cmwell-data-tools) which provides ways to download data from CM-Well, ingest data to CM-Well, or process with SPARQL queries using CM-Well.
These modules uses an API that is tailored for akka-stream/akka-http consumption,
I am referring to [`consume` API](https://github.com/thomsonreuters/CM-Well/blob/4f703b5b45345cc463f4b822a1d6466e7e72944a/server/cmwell-docs/cmwell-infodocs/API.Stream.CreateConsumer.md).
In this API, which is meant for stable resumable timebased data consumeption,
and is based on consecutive searches with range filters rather than scroll in Elasticsearch,
we decided to take a slightly different approach than what we did with the `iterator` API.
influenced greatly by the way akka-http handles responses, we decided to provide the token in the response headers.
After all, an `HttpResponse` in akka-http, has response headers available directly, where's the response body has to be consumed from a `Source[ByteString,Any]`.
The resulting code looked roughly like:
```scala
val mkRequest: String => Future[HttpResponse] = { token: String =>
  Http().singleRequest(HttpRequest( ... ))
}

Source.unfoldAsync(initialTokenRetrievedFromCreateConsumerAPI) { currentToken =>
  val res: Future[HttpResponse] = mkRequest(token)
  res.map {
    case HttpResponse(s, h, e, _) if s.isSuccess() => {
      h.find(_.name() == "X-CM-WELL-POSITION").flatMap { nextToken =>
        val next = nextToken.value()
        if(currentToken == next) None
        else {
          val data = e.dataBytes
          Some(next -> data)
        }
      }
    }
  }
}
```
But, if we are to take this one step further, we know that akka-http uses connection pool flows under the hood.
And why not use the flow directly within our nice streamy code?

That's exactly what I thought when I opened [yet another pull request to akka](https://github.com/akka/akka-stream-contrib/pull/33) (this time, to stream-contrib module), adding `unfoldFlow`.
The snippet above could be re-written using `unfoldFlow` to something like:
```scala
val mkRequest: String => HttpRequest = (token: String) => ...
val connFlow = Http().superPool[String]()

SourceGen.unfoldFlow(initialTokenRetrievedFromCreateConsumerAPI)(
  Flow.fromFunction(mkRequest)
      .via(connFlow)
      .map {
        case (Success(HttpResponse(s, h, e, _)),currentToken) if s.isSuccess() => {
          h.find(_.name() == "X-CM-WELL-POSITION").flatMap { nextToken =>
            val next = nextToken.value()
            if(currentToken == next) None
            else {
              val data = e.dataBytes
              Some(next -> data)
            }
          }
        }
      }
)
```
There's a lot not shown in this snippet, e.g: handling failures, or customizing connection pool, etc'...
But this demonstrates how we built an API that fits perfectly to akka stream, and how we utilize it efficiently.

## To be continued...
Next post, will be a bit more technical, and will show how users can unfold their own streams with akka-stream & CM-Well API more efficiently.
So stay tuned for _"parallelizing resumable bulk consumes with CM-Well & akka-stream"!_

[^footnote1]: Frankly, I'm surprised it's not a built-in part of scala collections.

[^footnote2]: I kept being asked to explain all the [fish](https://github.com/playframework/playframework/blob/2.3.10/framework/src/iteratees/src/main/scala/play/api/libs/iteratee/Enumeratee.scala#L59) in the code...
