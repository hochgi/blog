$(document).ready(function () {
  $(window.blogger.ui()).on('viewitem', function (event, post, element) {
    $(".article-content").each(function(index, element) {
      $(element).find('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });
  });
});