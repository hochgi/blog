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
