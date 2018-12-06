
var personSchema   = "http://dbpedia.org/data3/Person.json"
var propertiesItem = "http://www.w3.org/2000/01/rdf-schema#domain";
var subjectItem    = "http://www.w3.org/2000/01/rdf-schema#subClassOf";


function isInt(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function createSubMenus(getUrl) {
  $.get(getUrl, function(response) {
    $.each(response, function(key, item) {      
      var predicate = key;

      for(var type in item) {
          var value = item[type];
          if(type === subjectItem){
            createContextSubMenu(key, "itemSubject", key);            
          }
          else if (type === propertiesItem){
            createContextSubMenu(key, "itemPredicate", key);
          }
      }
    });
  });
}

function createContextSubMenu(id, parentId, title){  
  var subMenu = {
    "id" : id,
    "parentId" : parentId,
    "title" : title,
    "contexts" : [ "selection" ]
  };
  chrome.contextMenus.create(subMenu);
}

function createSubMenu(id, parentId, title) {
  
}

$(document).ready(function() {
  chrome.contextMenus.removeAll(function() {
  });

  var menuExport = {
    "id" : "Export",
    "title" : "Export RDFa Marker"
  };

  var menuItem = {
    "id" : "root",
    "title" : "Adicionar marcação RDFa a seleção",
    "contexts" : [ "selection" ]
  };

  var menuSubject = {
    "id" : "itemSubject",
    "parentId" : "root",
    "title" : "Marcar seleção como Sujeito",
    "contexts" : [ "selection" ]
  };

  var menuPredicate = {
    "id" : "itemPredicate",
    "parentId" : "root",
    "title" : "Marcar seleção como Objeto do Predicado",
    "contexts" : [ "selection" ]
  };


  chrome.contextMenus.create(menuExport);
  chrome.contextMenus.create(menuItem);
  chrome.contextMenus.create(menuSubject);
  chrome.contextMenus.create(menuPredicate);


  createSubMenus(personSchema);

  chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "Export") {
      chrome.tabs.create({
        url : '/html/export.html'
      });
    }
    if (clickData.menuItemId == "root" && clickData.selectionText) {
      if (isInt(clickData.selectionText)) {
        chrome.storage.sync.get([ 'total', 'limit' ], function(budget) {
          var newTotal = 0;
          if (budget.total) {
            newTotal += parseInt(budget.total);
          }
          newTotal += parseInt(clickData.selectionText);
          chrome.storage.sync.set({
            'total' : newTotal
          }, function() {
            if (newTotal >= budget.limit) {
              var notifOptions = {
                type : "basic",
                iconUrl : "icon48.png",
                title : "Limit reached!",
                message : "Uh oh, look's like you've reached your alloted limit."
              };
              chrome.notifications.create('limitNotif', notifOptions);

            }
          });
        });
      }
    }
  });

  chrome.storage.onChanged.addListener(function(changes, storageName) {
    chrome.browserAction.setBadgeText({
      "text" : changes.total !== undefined && changes.total.newValue !== undefined ? changes.total.newValue.toString() : ''
    });
  });
});
