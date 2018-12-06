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

  var menuSubject = {
    "id" : "itemSubject",
    "title" : "Marcar seleção como Sujeito",
    "contexts" : [ "selection" ]
  };

  var menuPredicate = {
    "id" : "itemPredicate",
    "title" : "Marcar seleção como Predicado",
    "contexts" : [ "selection" ]
  };

  var menuObject = {
    "id" : "itemObject",
    "title" : "Marcar seleção como Objeto",
    "contexts" : [ "selection" ]
  };

  var menuSeparator = {
    "id" : "menuSeparator",
    "title" : "menuSeparator",
    "type" : "separator",
    "contexts" : [ "all" ]
  };

  var menuExport = {
    "id" : "Export",
    "title" : "Export RDFa Marker",
    "contexts" : [ "all" ]
  };

  chrome.contextMenus.create(menuSubject);
  chrome.contextMenus.create(menuPredicate);
  chrome.contextMenus.create(menuObject);
  chrome.contextMenus.create(menuSeparator);
  chrome.contextMenus.create(menuExport);

  // createSubMenus();

  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "Export") {
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
        });
      });
    }
  });
});
