function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function populateSelection() {
  var selection = null;
  if (window.getSelection) {
    selection = window.getSelection();
  } else if (document.getSelection) {
    selection = document.getSelection();
  } else if (document.selection) {
    selection = document.selection.createRange();
  }
  if (selection.type == 'Range' && selection.getRangeAt && selection.getRangeAt(0).collapsed == false) {
    // ok
    var rdfaPreMarkupTag = document.createElement('rdfa-pre-markup');
    var range = selection.getRangeAt(0);
    rdfaPreMarkupTag.appendChild(range.extractContents());
    range.insertNode(rdfaPreMarkupTag);
  } else {
    // console.log("Problem on selection:");
    // console.log(selection);
    // console.log(selection.getRangeAt(0));
  }
}

/**
 * Example: <div resource="#alex" typeof="Person"> <span property="name">Alex Milowski</span> wrote the RDFa processor for this page. </div>
 *
 * @param typed
 * @param resource
 * @param typeOf
 * @param propertyValue
 * @param hrefValue
 * @returns
 */
function addRdfaMarker(typed, resource, typeOf, propertyValue, hrefValue) {
  $('rdfa-pre-markup').replaceWith(function() {
    var resourceVar = (resource != undefined && resource != null && resource != '' ? 'resource="#' + resource + '"' : '');
    var typeOfVar = (typeOf != undefined && typeOf != null && typeOf != '' ? 'typeof="' + typeOf + '"' : '');
    var propertyVar = (propertyValue != undefined && propertyValue != null && propertyValue != '' ? 'property="' + propertyValue + '"' : '');
    var hrefVar = (hrefValue != undefined && hrefValue != null && hrefValue != '' ? 'href="#' + hrefValue + '"' : '');
    if (typed == 'SUBJECT') {
      if (hrefVar != '') {
        var rfdaProperty = '' + //
        '<rdfa typed="OBJECT" class="rdfa-marker-object" ' + propertyVar + ' ' + hrefVar + ' title="RDFa Marker">' + //
        '  <rdfa class="rdfa-marker-join">' + this.innerHTML + '</rdfa>' + //
        '</rdfa>';
        return '<rdfa typed="SUBJECT" class="rdfa-marker-subject" ' + resourceVar + ' ' + typeOfVar + ' title="RDFa Marker">' + rfdaProperty + '</rdfa>';
      }
      return '<rdfa typed="SUBJECT" class="rdfa-marker-subject" ' + resourceVar + ' ' + typeOfVar + ' title="RDFa Marker">' + this.innerHTML + '</rdfa>';
    } else if (typed == 'OBJECT') {
      if (resourceVar == '') {
        return '<rdfa typed="OBJECT" class="rdfa-marker-world-property" ' + propertyVar + ' title="RDFa Marker">' + this.innerHTML + '</rdfa>';
      }
      var rfdaProperty = '<rdfa typed="OBJECT" class="rdfa-marker-object" ' + propertyVar + ' title="RDFa Marker">' + this.innerHTML + '</rdfa>';
      return '<rdfa typed="SUBJECT" class="rdfa-marker-subject" ' + resourceVar + ' ' + typeOfVar + ' title="RDFa Marker">' + rfdaProperty + '</rdfa>';
    } else {
      console.log('typed not processed for rfda marker');
    }
  });
}

function undoRfdaMarkups() {
  $('rdfa-pre-markup').replaceWith(function() {
    return this.innerHTML;
  });
}

var templateData = null;
var subjectItemData = [];
var propertiesItemData = [];
var objectsItemData = [];
$(document).ready(function() {
  $(document.body).attr('vocab', 'http://xmlns.com/foaf/0.1/');

  // load templates
  $.get('chrome-extension://' + chrome.runtime.id + '/html/templates.html', function(templateDataRequest) {
    templateData = templateDataRequest;
  }, 'html').always(function() {
    // init dialogs
    var openDialogSubjectDialog = $(templateData).find('div.openDialogSubject');
    var openDialogObjectDialog = $(templateData).find('div.openDialogObject');

    // get message actions on click
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      // EXPORT
      if (request.action == 'Export') {
        sendResponse(document.documentElement.outerHTML);
        return true;
      }

      // others
      populateSelection(); // get current selection before open dialog

      // load objects in page
      objectsItemData = []; // re-populate array
      $.each($('rdfa[typed="SUBJECT"]'), function(key, value) {
        var id = uuidv4();
        var text = $(value).text();
        var typeOf = $(value).attr('typeof');
        objectsItemData.push({
          id : key,
          text : text,
          typeOf: typeOf
        });
      });

      // actions open

      // FIRST FORM
      if (request.action == 'itemSubject') {
        openDialogSubjectDialog.find('span.selectedText').text($.selection());
        openDialogSubjectDialog.find('select.subjects').select2({
          placeholder : 'Selecione o tipo',
          allowClear : false,
          data : request.subjectItemData
        });
        openDialogSubjectDialog.find('select.properties').select2({
          placeholder : 'Selecione um predicado se existir',
          allowClear : true,
          data : request.propertiesItemData
        });
        openDialogSubjectDialog.find('select.properties').on('change', function(e) {
          var selectedValue = openDialogSubjectDialog.find('select.properties').val();
          if (_.isEmpty(selectedValue)) {
            openDialogSubjectDialog.find('tr.objectsTr').hide();
          } else {
            openDialogSubjectDialog.find('tr.objectsTr').show();
          }
        });
        openDialogSubjectDialog.find('select.objects').select2({
          placeholder : 'Selecione um objeto',
          allowClear : true,
          data : objectsItemData
        });
        openDialogSubjectDialog.find('tr.objectsTr').hide(); // default
        openDialogSubjectDialog.dialog({
          title : 'Subject',
          width : '500px',
          closeOnEscape : false,
          open : function(event, ui) {
            $('.ui-dialog-titlebar-close', ui.dialog | ui).hide();
          },
          buttons : {
            'Cancel' : function() {
              undoRfdaMarkups();
              openDialogSubjectDialog.dialog('close');
            },
            'OK' : function() {
              var selectedSubject = openDialogSubjectDialog.find('select.subjects').val();
              if (_.isEmpty(selectedSubject)) {
                alert('Selecione ao menos um tipo');
                return;
              } else {
                var selectedPropertyValue = openDialogSubjectDialog.find('select.properties').val();
                var selectedObjectValue = openDialogSubjectDialog.find('select.objects').val();
                if (_.isEmpty(selectedPropertyValue) == false && _.isEmpty(selectedObjectValue)) {
                  alert('Selecione ao menos um objeto');
                  return;
                } else {
                  var textSelected = openDialogSubjectDialog.find('span.selectedText').text();
                  if(_.isEmpty(selectedObjectValue) == false){
                    var selectedObjectData = openDialogSubjectDialog.find('select.objects').select2('data')[0];
                    selectedObjectValue = selectedObjectData.text;  // gets text of selection
                  }
                  addRdfaMarker('SUBJECT', textSelected, selectedSubject, selectedPropertyValue, selectedObjectValue);
                  openDialogSubjectDialog.dialog('close');
                }
              }
            }
          },
        }).dialog('open');
      }

      // SECOND FORM
      if (request.action == 'itemObject') {
        openDialogObjectDialog.find('span.selectedText').text($.selection());
        openDialogObjectDialog.find('select.properties').select2({
          placeholder : 'Selecione o tipo',
          allowClear : false,
          data : request.propertiesItemData
        });
        openDialogObjectDialog.find('select.objects').select2({
          placeholder : 'Selecione um objeto',
          allowClear : true,
          data : objectsItemData
        });
        openDialogObjectDialog.dialog({
          title : 'Object',
          width : '500px',
          closeOnEscape : false,
          open : function(event, ui) {
            $('.ui-dialog-titlebar-close', ui.dialog | ui).hide();
          },
          buttons : {
            'Cancel' : function() {
              undoRfdaMarkups();
              openDialogObjectDialog.dialog('close');
            },
            'OK' : function() {
              var selectedPropertyValue = openDialogObjectDialog.find('select.properties').val();
              var selectedObjectValue = openDialogObjectDialog.find('select.objects').val();
              if (_.isEmpty(selectedPropertyValue)) {
                alert('Selecione ao menos um tipo');
              } else {
                if (_.isEmpty(selectedObjectValue)) {
                  // word property
                  var textSelected = openDialogObjectDialog.find('span.selectedText').text();
                  addRdfaMarker('OBJECT', null, null, textSelected, null);
                } else {
                  var selectedObjectData = openDialogObjectDialog.find('select.objects').select2('data')[0];
                  var resource = selectedObjectData.text;
                  var typeOf = selectedObjectData.typeOf;
                  // property joinned
                  addRdfaMarker('OBJECT', resource, typeOf, selectedPropertyValue, null);
                }
                openDialogObjectDialog.dialog('close');
              }
            }
          },
        }).dialog('open');
      }
    });
  });

});