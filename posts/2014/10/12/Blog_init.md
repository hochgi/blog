Ok, first post. **WOOHOOO!**
Just finished setting up everything: syntax highlighting & markdown. a little example (taken from [here](http://softwaremaniacs.org/playground/showdown-highlight) which I pimped up a bit) shows it:

## Syntax highlighting is fun!

###HTML

```html
    &lt;h1&gt;HTML code&lt;/h1&gt;
    &lt;div class="some"&gt;This is an example&lt;/div&gt;
```
###Python

```python
    def func():
      for i in [1, 2, 3]:
        print "%s" % i
```
###Scala

```scala
    def fib(a: Int, b: Int): Stream[Int] = a #:: fib(b,a+b)
    fib(1,1).filter(_ % 2 == 0).take(10).toList
```

###~~Java~~ (deprecated)
```java
    class HelloWorldApp {
      public static void main(String[] args) {
        System.out.println("Hello World!"); // Print the string to the console.
      }
    }
```

highlighting is done with [highlight.js](https://highlightjs.org) & markdown with [pagedown extra](https://github.com/jmcmanus/pagedown-extra)

So, I'll probably babble here about all kind of things I find interesting. ~~Also, as the name says, I'm open to suggestions~~ _(So my wife just came up with a cool name... IM KEEPING IT!)_. apparently, coming up with a name for your blog, is quite hard... 

anyway, hope to have some fun. see ya' :)
