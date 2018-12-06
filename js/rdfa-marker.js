var personSchema = 'http://dbpedia.org/data3/Person.json'
var propertiesItem = 'http://www.w3.org/2000/01/rdf-schema#domain';
var subjectItem = 'http://www.w3.org/2000/01/rdf-schema#subClassOf';

var subjectItemData = [];
var propertiesItemData = [];

function loadData() {
  $.ajax({
    url : personSchema,
    type : 'GET',
    dataType : 'json',
    contentType : 'application/json',
    cache : false,
    async : false,
    timeout : 0,
    success : function(data, textStatus, jqXHR) {
      $.each(data, function(key, item) {
        for (var type in item) {
          var value = item[type];
          if (type === subjectItem) {
            subjectItemData.push({
              id : key,
              text : key
            });
          } else if (type === propertiesItem) {
            propertiesItemData.push({
              id : key,
              text : key
            });
          }
        }
      });
    },
    error : function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest);
    },
    complete : function(jqXHR, textStatus) {
    }
  });
}

$(document).ready(function() {
  chrome.contextMenus.removeAll(function() {
  });

  var menuSubject = {
    'id' : 'itemSubject',
    'title' : 'Marcar seleção como Sujeito',
    'contexts' : [ 'selection' ]
  };

  var menuPredicate = {
    'id' : 'itemPredicate',
    'title' : 'Marcar seleção como Predicado',
    'contexts' : [ 'selection' ]
  };

  var menuObject = {
    'id' : 'itemObject',
    'title' : 'Marcar seleção como Objeto',
    'contexts' : [ 'selection' ]
  };

  var menuSeparator = {
    'id' : 'menuSeparator',
    'title' : 'menuSeparator',
    'type' : 'separator',
    'contexts' : [ 'all' ]
  };

  var menuExport = {
    'id' : 'Export',
    'title' : 'Export RDFa Marker',
    'contexts' : [ 'all' ]
  };

  chrome.contextMenus.create(menuSubject);
  chrome.contextMenus.create(menuPredicate);
  chrome.contextMenus.create(menuObject);
  chrome.contextMenus.create(menuSeparator);
  chrome.contextMenus.create(menuExport);

  loadData();

  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === 'Export') {
      chrome.tabs.create({
        url : '/html/export.html'
      });
    } else {
      chrome.tabs.query({
        active : true,
        currentWindow : true
      }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action : info.menuItemId,
          subjectItemData : subjectItemData,
          propertiesItemData : propertiesItemData
        });
      });
    }
  });

});
