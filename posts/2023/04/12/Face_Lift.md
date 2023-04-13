# The blog gets a face lift

### Why?
Well… initially the blog was written as simple markdown posts. Markdown is an obvious choice for a blog, easy to write and maintain. I decided to render the markdown ad-hoc, so I used pagedown extra[^footnote1]. I also added syntax highlighting using [highlight.js](https://highlightjs.org/). This was simple and easy. Integrating with blogger was not too much of a fuss, I just wrapped every markdown post with:
```html
<div class="markdown" style="display: none;">
  # markdown content went here
</div>
```
And added a small js snippet to the theme HTML editor:
```js
// Yup! jquery was still a thing back then.
$(document).ready(function () {
  var converter = new Markdown.Converter();
  Markdown.Extra.init(converter);
  $(".markdown").each(function(index, element) {
    var md = element.textContent;
    var formatted = converter.makeHtml(md);
    element.textContent = "";
    element.innerHTML = formatted;
    $(element).find('code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    $(element).css('display','inline-block');
  });
});
```
I also added there the `<script>` tags with `src` of the libraries I used, directly hosted from my github account through [rawgit](https://rawgit.com/).
It worked out as expected.

### The plot thickens
Throughout the years, blogger made all [sorts](https://blogger.googleblog.com/2018/05/its-spring-cleaning-time-for-blogger.html) [of](https://blogger.googleblog.com/2019/01/an-update-on-google-and-blogger.html) [changes](https://blogger.googleblog.com/2020/05/a-better-blogger-experience-on-web.html), that occassionaly caused my blog to break in weird ways. Patching it every couple of years was not such a big deal. But at some point, I decided I want to ~~shoot myself in the foot~~ add \\(\\LaTeX\\) in my posts, so I added [MathJax](https://www.mathjax.org/) to the mix.

At that point, all the patching I did throughout the years, together with adding MathJax, turned the cute little snippet above into some [serious dumpster fire](https://github.com/hochgi/blog/blob/388cdd23388b370ef1b050aae450368779b85f98/js/highlight.plus.markdown.js).

Unsuprisingly, the blog became unusable in recent years. Rawgit service has been shutdown. libraries became outdated. And my script broke in weird ways.

### Time to refactor
OK then, obviously maintaining the blog with scripts to render markdown + syntax highlighting + \\(\\LaTeX\\) inside blogger is not something I want to continue doing. So I was thinking: what are my options?

1. Ditch blogger and host the blog somewhere I fully control.
2. Use blogger with pre-rendered HTML. Without any scripting shenanigans.

I didn't want to ditch blogger. It's convenient, support out of the box to some nice stats with google analytics. No need to care about hosting. etc'…

So I tried converting all my posts to HTML.

### Attempt #1
I needed \\(\\LaTeX\\) for all the nifty equations and I only used markdown to format the text nicely. Well… that's exactly what \\(\\LaTeX\\) is for. So I figured I can just reformat all my posts to \\(\\LaTeX\\), and then convert the `.tex` files to HTML using [`htlatex`](https://tug.org/tex4ht/). Obviously, I'll write future posts directly in \\(\\LaTeX\\) instead of markdown.
All I needed was to figure out how to do the syntax highlighting for code blocks.

I've used syntax highlighting in \\(\\LaTeX\\) [before](https://github.com/hochgi/latex-stuff/tree/master/observable), but needed something simpler and easier to maintain. I went for [Listings](https://ftp.cc.uoc.gr/mirrors/CTAN/macros/latex/contrib/listings/listings.pdf), as it seemed the most suitable solution. The [result](https://github.com/hochgi/blog/tree/5a279ce801644ee5d1b05b2aa96f1666cae5908c/tex) was… ok. The scala language[^footnote2] support was not ideal. The parser/lexer did not recognized stuff like class names, or types. But it's possible to "help" it a bit, by providing extra tokens with their style. The code blocks themselves were not as nice as I hoped:
![glitch-lines between the rows](https://raw.githubusercontent.com/hochgi/blog/master/img/facelift_01.png)
But the real deal breaker, was the fact that `htlatex` was not able to export listings as HTML.

### Attempt #2
Even before the last experiment, I had a gut feeling against it. The "pipeline" was not very simple.
Export markdown to \\(\\LaTeX\\) → fix \\(\\LaTeX\\) & syntax highlights manually → export to HTML using `htlatex` → maybe even fix HTML itself?

Well, MathJax already works great, and if I only add MathJax, the integration with blogger should be simple enough. So I went for direct markdown → HTML, and left MathJax inlined in the HTML.

I used [`pandoc`](https://pandoc.org/) to convert the markdown files to HTML. Unfortunately, syntax highlight for scala code with pandoc isn't great as well, but I figured I could easily just patch the HTML output directly. I decided this is good enough for now and I should stop shaving this yak. Since I need to touch the HTML output a bit[^footnote3], I figured I should commit it to the blog repo as well.

### What's next?
So now the blog is up and running again. All posts were converted, and everything works well. I will probably change the theme sometime soon (I chose the first thing just to get on with the tweaks). I also noticed some "inacuracies[^footnote4]" I should fix in some old posts. Perhaps archive the less relevant topics. But I also noticed many drafts I started and never finished over the years:
![draft posts](https://raw.githubusercontent.com/hochgi/blog/master/img/facelift_02.png)
There's some interesting ideas in these drafts I should definately write about. I guess we'll see soon.





[^footnote1]: I can no longer find the original sources, but I do give credit (with mostly broken links) in the [first blog post](http://blog.hochgi.com/2014/10/document.html).

[^footnote2]: Which is by far the most frequent on my blog

[^footnote3]: Some MathJax expressions contained stuff that `pandoc` "rendered" as HTML wrongly, and I needed to "undo" these.

[^footnote4]: I guess the blog stays true to is name ;)