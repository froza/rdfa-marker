function addClassToSelection() {
  var sel = window.getSelection ? window.getSelection() : document.selection.createRange();
  console.log(sel);
  if (sel.getRangeAt) {
    var range = sel.getRangeAt(0);
    var newNode = document.createElement("span");
    newNode.setAttribute('class', 'rdfa-marker');
    range.surroundContents(newNode);
  }
}

var templateData = null;
$(document).ready(function() {
  setInterval(function() {
    // interval get html code page marked
    var pageHTML = document.documentElement.outerHTML;
    chrome.storage.local.remove('pageHTML');
    chrome.storage.local.set({
      'pageHTML' : pageHTML
    });
  }, 200);

  // load templates
  $.get("chrome-extension://" + chrome.runtime.id + "/html/templates.html", function(templateDataRequest) {
    templateData = templateDataRequest;
  }, 'html').always(function() {
    // init dialogs
    var openDialogSubjectDialog = $(templateData).find('div.openDialogSubject');

    // get message actions on click
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      // console.log(request);
      addClassToSelection();
      // actions open
      if (request.action == 'openDialogSubject') {
        openDialogSubjectDialog.dialog().dialog("open");
      }
      if (request.action == 'itemPredicate') {
        openDialogSubjectDialog.dialog().dialog("open");
      }
      if (request.action == 'itemObject') {
        openDialogSubjectDialog.dialog().dialog("open");
      }
    });

  })

});