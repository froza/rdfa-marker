function addClassToSelection(cssClass) {
  var sel = window.getSelection ? window.getSelection() : document.selection.createRange();
  console.log(sel);
  if (sel.getRangeAt) {
    var range = sel.getRangeAt(0);
    var newNode = document.createElement('span');
    newNode.setAttribute('class', cssClass);
    range.surroundContents(newNode);
  }
}

var templateData = null;
var subjectItemData = null;
var propertiesItemData = null;
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
  $.get('chrome-extension://' + chrome.runtime.id + '/html/templates.html', function(templateDataRequest) {
    templateData = templateDataRequest;
  }, 'html').always(function() {
    // init dialogs
    var openDialogSubjectDialog = $(templateData).find('div.openDialogSubject');
    var openDialogPropertiesDialog = $(templateData).find('div.openDialogProperties');

    // get message actions on click
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log(request);
      // actions open
      if (request.action == 'itemSubject') {
        openDialogSubjectDialog.find('select.subjects').select2({
          data : request.subjectItemData
        });
        openDialogSubjectDialog.dialog({
          title : 'Select Subject',
          width : '500px',
          buttons : {
            'Cancel' : function() {
              openDialogSubjectDialog.dialog('close');
            },
            'OK' : function() {
              addClassToSelection('rdfa-marker-subject');
              openDialogSubjectDialog.dialog('close');
            }
          },
        }).dialog('open');
      }
      if (request.action == 'itemPredicate') {
        openDialogPropertiesDialog.find('select.properties').select2({
          data : request.propertiesItemData
        });
        openDialogPropertiesDialog.dialog({
          title : 'Select Properties',
          width : '500px',
          buttons : {
            'Cancel' : function() {
              openDialogPropertiesDialog.dialog('close');
            },
            'OK' : function() {
              addClassToSelection('rdfa-marker-roperties');
              openDialogPropertiesDialog.dialog('close');
            }
          },
        }).dialog('open');
      }
      if (request.action == 'itemObject') {
        console.log('itemObject');
      }

    });

  })

});