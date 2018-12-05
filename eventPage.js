var menuItem = {
    "id": "root",
    "title": "Adicionar marcação RDFa a seleção",
    "contexts": ["selection"]
};

var menuSubject = {
    "id": "itemSubject",
    "parentId": "root",
    "title": "Marcar como Sujeito",
    "contexts": ["selection"]
};

var menuPredicate = {
    "id": "itemPredicate",
    "parentId": "root",
    "title": "Marcar como Predicado",
    "contexts": ["selection"]
};

var menuObject = {
    "id": "itemObject",
    "parentId": "root",
    "title": "Marcar como Objeto",
    "contexts": ["selection"]
};

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

chrome.contextMenus.create(menuItem);
chrome.contextMenus.create(menuSubject);
chrome.contextMenus.create(menuPredicate);
chrome.contextMenus.create(menuObject);


chrome.contextMenus.onClicked.addListener(function(clickData){   
    if (clickData.menuItemId == "root" && clickData.selectionText){    
        if (isInt(clickData.selectionText)){          
            chrome.storage.sync.get(['total','limit'], function(budget){
                var newTotal = 0;
                if (budget.total){
                    newTotal += parseInt(budget.total);
                }

                newTotal += parseInt(clickData.selectionText);
                chrome.storage.sync.set({'total': newTotal}, function(){               
                if (newTotal >= budget.limit){
                    var notifOptions = {
                        type: "basic",
                        iconUrl: "icon48.png",
                        title: "Limit reached!",
                        message: "Uh oh, look's like you've reached your alloted limit."
                    };
                    chrome.notifications.create('limitNotif', notifOptions);

                    }
                });
            });
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});
