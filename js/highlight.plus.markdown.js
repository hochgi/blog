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
