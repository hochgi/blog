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
      /* if inline, element style should be:
         display: inline;
         border-radius: 5px;
         padding: 3px !important;
         box-shadow: 1px 1px 4px #666;
      */
    });
    $(element).css('display','inline-block');
  });
});
