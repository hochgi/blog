 _"Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done."_[^footnote1]

When I initially started writing this post long ago, I originally named it "No Estimates!"[^footnote2]. And while I still agree with most of what I wrote back then, I feel that the title less reflects my current stance on the subject. We live in a less-than-ideal world. Being pragmatic and working within the current framework is more important than being a purist and complain about what's wrong. \
But before we delve into pragmatism, we need to understand what is the problem with estimates in the first place. So here are my thoughts on giving time estimations in the software engineering industry.

## You can't have it both ways
As developers, we often need to choose between different trade-offs. Whether it's choosing your distributed data storage model, acknowledging [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem) constraints, and choosing either **consistency** or **availability** in a distributed system, choosing a technology that maximizes either **throughput** or **latency**, choosing a randomness model ([**Las-Vegas**](https://en.wikipedia.org/wiki/Las_Vegas_algorithm) vs. [**Monte-Carlo**](https://en.wikipedia.org/wiki/Monte_Carlo_algorithm)), or building a predictive model that favors **precision** over **recall**, etc… \
But when it comes to development culture, we often fail to recognize different trade-offs in our day to day work. Ignoring a technical trade-off may result in malfunctioning software. When it comes to an organizational culture trade-off that is being ignored, it can cause much more harm.

## A trade-off
Organizational life is full of trade-offs. Let me focus just on one: _Release cycles should either commit to deliver **on time**, or **on content**, but never both._ This seems intuitive and simple, obviously everyone agree, no?\
No! Have you ever been asked to provide an "effort estimate", or "time estimate" on a task? If so, whoever asked you for the estimate did not make a conscious choice regarding the on-time vs. on-content trade-off. They implicitly delegated a different decision down to you, whether they (or you) were even aware to it. But more on that later.

**On time** means that you don't promise on content delivery, but commit on a release date. And you release, even if the change is minimal, or even if not apparent to clients at all (only internal changes & bug fixes)[^footnote3].

**On content** means you plan for specific functionality to be delivered, but you can't promise when to deliver it. No doubt you will encounter many sub-tasks you did not thought of initially, and which you should (must) do prior to the content promised for delivery[^footnote4].

Either case, there no need to get an estimate on a specific task.

## Why not actually?
_"This seems to work for our org…"_ \
Let's disregard the fact that forcing an estimate from the developer gives you an educated guess at best[^footnote5], and a mere fortune telling[^footnote6] at worst, and focus on how it affects the dev team, and how it perceived by management/product.

When we give an estimate, we implicitly "commit" to both **time** _AND_ **content**, whether we know it, or not. But something has to give. We can't have it all. Let's rephrase the trade-off:

We can deliver **on time**, **on content**, or **on quality**: choose 2.

### What does quality has to do with this?
Most organizations have a backlog of tasks, probably prioritized. One should try not to care how long a single task will take. The reasoning behind it is something most developers have a gut feeling about, but might not be fully aware to. When working on a task, you often find out peripheral area's that require changes. A good developer should know when such peripheral changes are becoming ["Yak Shaving"](https://en.wiktionary.org/wiki/yak_shaving), and when it's likely gonna pay off to just do it. \
Developers can then feed a healthy backlog with "TODOs" they encounter on the fly and don't want to "inline" within their current subtask. Such work flow is flexible, and leaves room for gradual fine-tuning by developers. Not only that, but it has the merits of allowing the developers take smaller tasks, sometimes purely technical, and offload to their future self, knowing it will get done. Smaller tasks means easier reviews, higher confidence on every increment, and faster delivery cycles in general. \
The fact that we get things done faster, and all "TODOs" - aka maintainance work gets done, means higher quality software.

But, whoever in your organization is in charge on prioritizing the backlog of tasks, may have different views and preferences than the actual team doing all the coding. That's alright.

Even if they prioritize solely based on external needs, e.g: bugs reported by clients, feature requests, etc… \
The dev team can, should, and (hopefully) will adjust.\
They will take on more maintenance tasks inlined within other tasks. This is not ideal, but it is a workable environment. So long as we make sure to "let them" inline such maintainance work.

When there's a high level of trust towards the dev team, prioritization of tasks is made in a way that maintenance work get a fair share in every cycle. We trust the developers to not spam JIRA (et al) with redundant work. Or in the second scenario, we trust them to not waste time, to "raise flags" when unforseen issues pop up, and we let them do their thing without pressuring imaginary time constraints.

On the other hand, when you ask for an estimate on a task, you're effectively asking for a deadline. Or in other words, a _time AND content_ constraint. \
Even if you declare that it's not a binding commitment, and just a rough estimate to reflect for the management or product owners, the developer giving that estimate will implicitly accept this as a deadline (and don't even get me started on hard deadlines!).

Now, that we've understood the fundamental trade-off, let's take a deeper look into why estimates often fail in practice.

### What's in an estimate?
Allow me to offer a glimpse into the mind of a developer being asked for an estimate:

1. We need to account for "unknown unknowns" (aka "TODOs" / inilined maintainance).
2. And we don't want to be "way off", or else… (will we be held accountible?)
3. But also, we don't want to be that person who always gives an overly exagerated estimate.
4. We're "pleasers" so we'll probably just say what you want to hear.
5. We'll then try our best to make it.

This means we don't offload "TODOs" nor inline maintenance work enough (if at all).\
Even if we try to prioritize maintenance work post-delivery (be honest. will you? really?), the maintainance itself is more expensive.\ 
Solving an issue you just discoverred, and have full context on, is much easier than coming back to it after a while, not to mention maybe other stuff that didn't exist before already depend on your faulty code. So no, a "promise" from management to pay off "tech debt" in the next cycle/quarter/whatever… isn't good enough.

So, yeah. maybe an estimate is not a "deadline", but it has a very similar effect. It still causes software rot due to neglecting maintainance work, which in turn causes stress, fatigue, weariness, and de-motivating the dev team.

By not caring at all how long a task will take, you actually say you have confidence in your dev team to take as much time as needed to close the task. You trust them not to take too long (or "slack off"), and trust them to raise flags if some tasks prolong beyond the scope of a "regular task" they're used to. This trust is empowering, motivating, and creates a healthier dev environment.

### "We're not using estimates, we do story points."
oh really..? \
Story points **are** estimates. And a bad one. Ask the guy who invented them[^footnote7].

## Becoming a healthy organization
It's important to note that no one is asking time estimates in ill intent[^footnote8]. It's obvious that time estimates make the job of the dev manager, product owner, or project manager much easier. Clients are happy (in short term), since they have (an illusion of?) transparency on progress, which are good reasons overall. And yes, working without estimates is going to be harder. Sort of like how writing multi threaded async code is harder than single threaded blocking code, or how working with a distributed NoSQL database is harder than a single node relational database. But eventually, much like in these examples, it is often becomes necessary in the long run.

## Being pragmatic
Your organization currently relies on estimates for planning. "We can't ditch this. That's impractical", they may say.\
OK then, what is the essence of the need to provide estimates?

Transparency of progress for management? Ability to plan ahead? Ensuring development stays "on track" and doesn't stray off in irrelevant directions?

I think all of these can be achieved by estimating without asking _developers_ for estimates.

Wait, what…?

If you read carefully the previous sections, you'll see I say nothing is inherently bad with estimations on their own. I advocate for not forcing them out from developers. I'll also add, risking stating the obvious, that we should take estimations for what they are: Estimations! Not predictions. Not a commitment.

Lets unpack this:

- **accountability** - a developer giving an estimation feels accountable for it, and would be tempted to take shortcuts implicitly. Better to have these shortcuts made into an explicit choice. Either way (taking the shortcut, or spending the extra time to do something the "right way"), we lift the pressure from developers feeling accountable for either not making "on time", or on-time delivery of a buggy second grade lousy solution.
- **transparancy** - despite the reputation management/PMs usually have in the eyes of development teams, I don't think anyone wants to compromise on quality. But this is usually a "black box". Management usually only knows a feature can be delivered in a week "the hacky way", or a month "the right way". Given this opaque repeated choice, I'd bet everyone would be tempted to choose the fast way once in a while.
- **planning** - more often then not, estimates are asked for making a decision. Having several business goals, they may not all fit in our capacity to deliver. We need to pick a subset of "big rocks" to focus on in the next cycle.

### My suggestion?
Management/PMs should try to estimate how long a task might take without asking the developers. Not even "t-shirt size". Not even get "approval" - no _"Do you think its doable within…?"_ kind of questions!\
Estimations should be kept by management/PMs to themselves, and not even share with most developers. We need to remove any sense of "accountability" on the dev team. real, or perceived.

### But how?
Management/PMs can "interrogate" developers for the **"what"** (and sometimes _"how"_) instead of asking for **"when"** or **"how long"**.
I wrote above, that experienced developers have a "gut feeling" about what needs to be done. \
But what if not? How can we tell whether our developers has the "right" kind of gut feelings? \
A task, any task, is pottentially an infinite tree of subtasks. Some are essential, others I called out as "yak shaving" before. An experienced developer will know when to stop "unfolding" this infinite fractal tasks tree. \
But, by having a PM "interrogate" the developer, they're basically unfolding the tree together. Each developer has its own pace, and different prefferences for the ideal "resolution" of breaking into subtasks. This is very individual, so spending little time, pairing 1:1 with every developer is needed. I think an hour every week or 2 should usually be sufficient. If the team has 5 developers, each requires such 1:1 sessions to unfold what & how they're about to do in detail[^footnote9], it means 5 hours every week or 2 of "extra work" for the PM.

You're probably not very excited to read this, but here's the silver lining: How much time does the PMs in your organization already spend in grooming/planning sessions? The suggested sessions are actually private 1:1 detailed grooming & planning. And after those sessions, the estimation that the PM comes up with, is as good as an estimation asked from the developers - if not better (no hidden encapsulated inlined work PM is not aware of…) 

Over time, the PM "learns" through their 1:1 sessions how much time tasks are likely to take for each developer in their team. Over time, they'll acquire a sense for when things stray off into the realm of yak shaving, and be able to push back when needed. Over time they'll learn about the implicit tradeoffs (now made explicit) developers make, and learn to account for them.\
This is much harder (at least at start) for the PM, but it pays off.

Whatever estimations the PM has, they should keep it to themselves, and not even share with the devs. This is essential for 2 main reasons. I've already mentioned the need to remove sense of time accountibility from developers (how can one be accountible for a "wrong" estimation they did not even knew about?). I'll also add that for the PM to actually adjust and learn to refine their estimates, they must not rely on estimations comming from developers, which encapsulate too much (all the implicit tradeoffs we want to make explicit). This is a learning and refining process that takes time.

### Probabillity
I may be stating the obvious here, but estimates are guesses. As such, there's always a chance we're wrong. That should be OK for a guess. \
When developers estimate, they take into account the chance of possible problems. Sometime they occur, sometimes not.\
The PM will learn to account for these as well.

Another (hopefully) obvious statement: since estimates are probabilities, a sum of probabilities makes no sense. You might sum the time, but you also should multiply for the chance the guess was correct[^footnote10]. Meaning very quickly that guess would be as good as guessing the lottery winning numbers.

Consider this as a guideline for the PM who learns how to adjust their estimates - don't estimate on too many tasks at once.

## Summing up
In conclusion, navigating the complexities of modern software development requires a shift away from rigid, un-nuanced time estimates that force developers to make unnecessary compromises. A more flexible, trust-based approach can be achieved by eliminating the pressure of strict deadlines and fostering an environment where developers can focus on quality and gradual improvements. This leads to higher quality software and a more motivated team.

As the Agile Manifesto wisely states:

_"Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done."_

[^footnote1]: The [Manifesto for Agile Software Development](https://agilemanifesto.org)

[^footnote2]: I'm picking up oin an old draft that has been lying around for [quite a while](http://blog.hochgi.com/2023/04/face-lift.html#fnref5)

[^footnote3]: For an on-time delivery cycle example, take a look at [how canonical plan their releases](https://ubuntu.com/about/release-cycle).

[^footnote4]: This is how most open source releases happen. No hard commitments on release dates. New versions are released when done.

[^footnote5]: Given that the developer is well versed in the code, fully understand the task, and have enough experience in that organization to also encapsulate in his guess the time needed from peers - be it devops / QA / code reviewers / UI designers / etc…

[^footnote6]: I've taken "estimates are fortune telling" idea from [Andy Hunt](https://twitter.com/PragmaticAndy), when he mentioned it on the [co-recursive podcast](https://corecursive.com/029-learn-to-think-andy-hunt). Great episode BTW, you should go listen to it.

[^footnote7]: Ron Jefferies: [Story Points Revisited](https://ronjeffries.com/articles/019-01ff/story-points/Index.html)

[^footnote8]: Well… Depends on who you ask. I bet if you'll ask [Erik Meijer](https://twitter.com/headinthebox), he'll probably tell you it's a form of abusive [subtle controll](https://www.youtube.com/watch?v=2u0sNRO-QKQ&amp;t=04m57s).

[^footnote9]: I mean of course unfolding only 1 level deep in the current sub-tree - the immediate next thing to do. Not the whole pottentially infinite fractal. 

[^footnote10]: This is very simplistic, but if we assume a task never takes less than what we guessed it would take - which makes sense when you think about it, one can always continue refining infinitely until time is up. Then the statement holds. Let's assume we're 50% right on our guesses. Given 3 guesses for 3 tasks that'll take 3, 2, & 5 days. Guessing right on all 3 means 10 days. The chance of actually being right is 0.5×0.5×0.5 = 12.5%. The more you guess, less likely you'll guess right.