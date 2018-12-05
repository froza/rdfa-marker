$(document).ready(function() {
  setInterval(function() {
    // interval get html code page marked
    var pageHTML = document.documentElement.outerHTML;
    chrome.storage.local.remove([ 'pageHTML' ], function() {
    });
    chrome.storage.local.set({
      'pageHTML' : pageHTML
    }, function() {
    });
  }, 200);

});