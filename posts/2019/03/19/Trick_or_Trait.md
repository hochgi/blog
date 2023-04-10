## tl;dr
Scala's traits are tricky. There are many pitfalls. especially, if you're dealing with composed/stacked traits. I recently had an interesting conversation on whether it is best to extend a trait in another trait, or enforce a mixin with self typing (which apparently, can be done in several ways). This led me to some new findings (for me at least), and insights, on how and when to use the different approaches.

## What's wrong with the good old abstract class?
Scala has `abstract class`es, but they are limited. You cannot inherit more than one `class` or `abstract class`. Scala's way to achieve "multiple inheritance" is via "trait mixins". It also allows you to `extend` a trait with another trait, but according to the [specs](https://www.scala-lang.org/files/archive/spec/2.12/05-classes-and-objects.html#templates):

> … A template \\(sc \text{ with } mt_1 \text{ with } \ldots \text{ with } mt_n \\{ stats \\}\\) consists of a constructor invocation \\(sc\\) which defines the template's _superclass_, trait references \\(mt_1,\ldots,mt_n (n≥0)\\), which define the template's _traits_, and a statement sequence _stats_ which contains initialization code and additional member definitions for the template.
>
> Each trait reference \\(mt_i\\) must denote a [trait](https://www.scala-lang.org/files/archive/spec/2.12/05-classes-and-objects.html#traits). By contrast, **the superclass constructor \\(sc\\) normally refers to a class which is not a trait**. It is possible to write a list of parents that starts with a trait reference, e.g. \\(mt_1 \text{ with } \ldots \text{ with } mt_n\\). In that case the list of parents is implicitly extended to include the supertype of \\(mt_1\\) as first parent type. The new supertype must have at least one constructor that does not take parameters. In the following, we will always assume that this implicit extension has been performed, so that the first parent class of a template is a regular superclass constructor, not a trait reference.

This is not something you would normally do. And there's a good reason for it.

## When should you use `extends` on a trait?
Scala's traits are "stackable", and can be used for "stackable modifications". This feature is well blogged on, and not the main purpose of this current post, so go ahead and take a look at the basic example  from [Programming in Scala book](https://booksites.artima.com/programming_in_scala_3ed/examples/html/ch12.html#sec5).

The reason it works so well, is because each trait stacked extend `IntQueue`, and thus enforcing it's own place in [_class linearization_](https://www.scala-lang.org/files/archive/spec/2.12/05-classes-and-objects.html#class-linearization) to the left of the implementing class, so `super` calls are always called in proper order. If we would not have extended, but merely enforce a mixin with self type, we wouldn't be able to call `super`, thus not be able to stack operations.

```scala
import scala.collection.mutable.ArrayBuffer

abstract class IntQueue {
  def get(): Int
  def put(x: Int)
}

trait Doubling extends IntQueue {
  abstract override def put(x: Int) = { super.put(2 * x) }
}

trait Incrementing extends IntQueue {
  abstract override def put(x: Int) = { super.put(x + 1) }
}

// replacing definition with commented out
// self typing code won't compile:
//
// trait Filtering { this: IntQueue =>
trait Filtering extends IntQueue {
  abstract override def put(x: Int) = {
    if (x >= 0) super.put(x)
  }
}

class BasicIntQueue extends IntQueue {
  private val buf = new ArrayBuffer[Int]
  def get() = buf.remove(0)
  def put(x: Int) = { buf += x }
}
```
Usage:
```scala
scala> val q = new BasicIntQueue with Doubling with Filtering with Incrementing
q: BasicIntQueue with Doubling with Filtering with Incrementing = $anon$1@5e3dd1f3

scala> q.put(-3);q.put(0);q.put(-1);q.put(1)

scala> q.get()
res1: Int = 2

scala> q.get()
res2: Int = 0

scala> q.get()
res3: Int = 4

scala> q.get()
java.lang.IndexOutOfBoundsException: 0
  at scala.collection.mutable.ResizableArray.apply(ResizableArray.scala:46)
  at scala.collection.mutable.ResizableArray.apply$(ResizableArray.scala:45)
  at scala.collection.mutable.ArrayBuffer.apply(ArrayBuffer.scala:49)
  at scala.collection.mutable.ArrayBuffer.remove(ArrayBuffer.scala:173)
  at BasicIntQueue.get(IntQueue.scala:30)
  ... 36 elided
```

## class linearization?
The [specs]() define linearization according to the following formula:

$$
\mathcal{L}\big(\mathcal{C}\big)=\mathcal{C},\mathcal{L}\big(\mathcal{C_n}\big)\vec{+}\ldots\vec{+}\mathcal{L}\big(\mathcal{C_1}\big)
$$

Where \\(\vec{+}\\) means you add new traits to the right, but only keep the right most appearance of the trait.

$$
\begin{alignat*}{3}
    a,A\vec{+}B&= a,\big(A\vec{+}B\big) && \textbf{ if }a\notin B \\\\
               &= A\vec{+}B             && \textbf{ if }a\in B
\end{alignat*}
$$

This means a class \\(\mathcal{C}\\), or in our case `q`, is linearized as:
```scala
val q = new BasicIntQueue with Doubling with Filtering with Incrementing
```
`q` = \\(\mathcal{C}\\)
`BasicIntQueue` = \\(\mathcal{L}\big(\mathcal{C}_1\big)=\\{BasicIntQueue,IntQueue,AnyRef,Any\\}\\)
`Doubling` = \\(\mathcal{L}\big(\mathcal{C}_2\big)=\\{Doubling,IntQueue,AnyRef,Any\\}\\)
`Filtering` = \\(\mathcal{L}\big(\mathcal{C}_3\big)=\\{Filtering,IntQueue,AnyRef,Any\\}\\)
`Incrementing` = \\(\mathcal{L}\big(\mathcal{C}_4\big)=\\{Incrementing,IntQueue,AnyRef,Any\\}\\)

$$
q,\mathcal{L}\big(\mathcal{C}_4\big) \vec{+} \mathcal{L}\big(\mathcal{C}_3\big) \vec{+} \mathcal{L}\big(\mathcal{C}_2\big) \vec{+} \mathcal{L}\big(\mathcal{C}_1\big) \\\\
q,\mathcal{L}\big(\mathcal{C}_4\big) \vec{+} \big(\mathcal{L}\big(\mathcal{C}_3\big) \vec{+} \big(\mathcal{L}\big(\mathcal{C}_2\big) \vec{+} \mathcal{L}\big(\mathcal{C}_1\big)\big)\big) \\\\
q,Incrementing,\mathcal{L}\big(\mathcal{C}_3\big) \vec{+} \big(\mathcal{L}\big(\mathcal{C}_2\big) \vec{+} \mathcal{L}\big(\mathcal{C}_1\big)\big) \\\\
q,Incrementing,Filtering,\mathcal{L}\big(\mathcal{C}_2\big) \vec{+} \mathcal{L}\big(\mathcal{C}_1\big) \\\\
q,Incrementing,Filtering,Doubling,\mathcal{L}\big(\mathcal{C}_1\big) \\\\
q,Incrementing,Filtering,Doubling,BasicIntQueue,IntQueue,AnyRef,Any \\\\
$$

## Why should you care?
Well, to understand the subtle differences between extending or enforcing a mixin, you need to know about how class linearization is performed. Now, notice how when we defined the traits with `extends`, the linearization of that trait transitively contained the extended other trait. e.g: `Doubling` class linearization, contained `IntQueue`. This means, that as a user, no matter how I mix `Doubling` in my bottom type, in the linearization, `IntQueue` will always going to be found right to `Doubling`, and will always be the `super`. More importantly, `IntQueue` is going to be initialized prior to `Doubling` since initialization order takes effect from the right most element in the linearization, and advancing to the left. This is of-course  not a problem with `IntQueue` case, and exactly what we want and expect, but sometimes, you would want to let the end user be in charge of initialization order.

## The weird case of the `val` in the `trait`
As you probably know, traits are not interfaces. A trait can hold non abstract members, whether `def`s, `val`s, etc'... normally, you shouldn't care about the linearization of your class. But if your traits interact with each other, and contain (possibly uninitialized) `val`s, you might (depends on how you defined your class hierarchy and inter-trait interaction) encounter some puzzling `NullPointerException`s. In these cases, since scalac prohibits any form of circular inheritance, a user can re-arrange mixins order of the bottom type, and carry on. Given of-course the user has full control of the class linearization. When you enforce a mixin using self typing, your trait, and the trait you enforce mixin with, can appear in any order once linearized. The user is in full control. And you can (though not necessarily should) use anything from the enforced mixin, as if it was "extended regularly". As long as you also type alias `this`.

## `this` aliasing?
`this` aliasing isn't something new or unknown. There are many good reasons to do so[^footnote1], but for now, just know there are several ways to do it, with very subtle differences between them.
```scala
trait A { self => ... }
trait A { self: B => ... }
trait A { this: B => ... }
trait A { _: B => ... }
```
In the first option, you give an alias to `this`, usually, so you would be able to refer to it from an inner class (which is quite handy if you utilize path dependent types). The second is interesting, it will force implementing classes to also mix in `B` trait. Options 3 & 4 are equivalent as much as I know (please correct me if I'm wrong).

## conclusion
Adhering to the [principle of least power](http://www.lihaoyi.com/post/StrategicScalaStylePrincipleofLeastPower.html), you should choose the most restrictive approach you can get by with. If all you need is to know your trait is always mixed with another trait[^footnote2], use only a type (option 4). Also if you need to use another trait capabilities, but only from within a method, or in any way not during initialization, use self typing (options 2, 3, 4). If you also have inner classes and refers to `this` in the code, alias it as something else (convention is "self") to ease readability. If you depend on another trait during initialization, then extend it to ensure correct ordering in class linearization. But do it only if you really must.

[^footnote1]: maybe more on that in a future post.

[^footnote2]: you may think what would be a good usecase. Well, I'm wondering about it myself. Maybe if you have a sealed trait, and you want the implementing classes to have some functionality, but you don't want any other class to have that functionality and still want to put it in a different file. This way you enforce a trait from another file can only be mixed in with your sealed trait, and offer functionality without overloading too much logic in a single file. got any better idea? I'd love to hear :)
