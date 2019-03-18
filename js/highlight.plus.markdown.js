//this goes in line 1414 of theme - won't work as external script
//Mathjax import line:
//<script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML&delayStartupUntil=configured' type='text/javascript' async/>
// note the delayStartupUntil=configured of imported script.
var MathJaxUtils = (function () {

  let obj = {};
  let scripts = null;

  obj.render = function (element) {
    scripts = new Array();
    $(element).find("script[id^='MathJax-Element']").each(function () {
      scripts.push({
        displayElement: $(this).prev("div")[0],
        scriptElement: this
      });
    });
    //remove all html within MathJax script tags so it doesn't get typset again when Typeset method is called
    $(element).find("script[id^='MathJax-Element']").remove();
    //render Math using original MathJax API and in callback re-insert the MathJax script elements in their original positions
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, element, typeSetDone]);
  };

  //callback for Typeset method
  function typeSetDone() {
    for (var i = 0; i &lt; scripts.length; i++) {
      $(scripts[i].displayElement).after(scripts[i].scriptElement);
    }
    //reset scripts variable
    scripts = [];
  };

  return obj;
}());

var converter = null;
setTimeout(function() {
  blogger.ui().configure().view();
}, 0);
$(window.blogger.ui()).on(&#39;viewitem&#39;, function (event, post, element) {

  MathJax.Hub.Config({
    TeX: { extensions: [&quot;enclose.js&quot;,&quot;AMSmath.js&quot;, &quot;AMSsymbols.js&quot;]
    //tex2jax: { inlineMath: [[&#39;$&#39;,&#39;$&#39;]] },
    //processEscapes: true
  }});

  MathJax.Hub.Configured();

  $(&quot;.markdown&quot;).each(function(index, element) {
    if($(element).css(&#39;display&#39;) == &#39;none&#39;) {

      if(!converter) {
        var converter = new Markdown.Converter();
        Markdown.Extra.init(converter);
      }

      MathJaxUtils.render(element);

      var md = element.textContent;
      var formatted = converter.makeHtml(md);
      element.textContent = &quot;&quot;;
      element.innerHTML = formatted;

      $(element).find(&#39;code:not(.inline)&#39;).each(function(i, block) {
        hljs.highlightBlock(block);
      });
      $(element).css(&#39;display&#39;,&#39;inline-block&#39;);
    }
  });

});

/*
var converter = null;
setTimeout(function() {
  blogger.ui().configure().view();
}, 0);
$(window.blogger.ui()).on(&#39;viewitem&#39;, function (event, post, element) {
  $(&quot;.markdown&quot;).each(function(index, element) {
    if($(element).css(&#39;display&#39;) == &#39;none&#39;) {
      if(!converter) {
        var converter = new Markdown.Converter();
        Markdown.Extra.init(converter);
      }
      var md = element.textContent;
      var formatted = converter.makeHtml(md);
      element.textContent = &quot;&quot;;
      element.innerHTML = formatted;
      $(element).find(&#39;code:not(.inline)&#39;).each(function(i, block) {
        hljs.highlightBlock(block);
      });
      $(element).css(&#39;display&#39;,&#39;inline-block&#39;);
    }
  });
});
*/
/*
$(document).ready(function () {
  var converter = new Markdown.Converter();
  Markdown.Extra.init(converter);
  $(".markdown").each(function(index, element) {
    var md = element.textContent;
    var formatted = converter.makeHtml(md);
    element.textContent = "";
    element.innerHTML = formatted;
    $(element).find('code:not(.inline)').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    $(element).css('display','inline-block');
  });
});
*/
