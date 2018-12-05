function isInt(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function createSubMenus() {
  createSubMenuSubject("http://dbpedia.org/data3/Person.json", "itemSubject");
  createSubMenuPredicate("http://dbpedia.org/data3/Person.json", "itemPredicate");
}

function createSubMenuSubject(url, parentId) {
  var subMenu = createSubMenu(url, parentId, url);
  chrome.contextMenus.create(subMenu);
}

function createSubMenuPredicate(getUrl, parentId) {
  $.get(getUrl, function(response) {
    $.each(response, function(key, item) {
      var predicate = key;
      var subMenu = createSubMenu(key, parentId, key);
      chrome.contextMenus.create(subMenu);
    });
  });
}

function createSubMenu(id, parentId, title) {
  return {
    "id" : id,
    "parentId" : parentId,
    "title" : title,
    "contexts" : [ "selection" ]
  };
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
    "title" : "Marcar seleção como Predicado",
    "contexts" : [ "selection" ]
  };

  var menuObject = {
    "id" : "itemObject",
    "parentId" : "root",
    "title" : "Marcar seleção como Objeto",
    "contexts" : [ "selection" ]
  };

  chrome.contextMenus.create(menuExport);
  chrome.contextMenus.create(menuItem);
  chrome.contextMenus.create(menuSubject);
  chrome.contextMenus.create(menuPredicate);
  chrome.contextMenus.create(menuObject);

  createSubMenus();

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
