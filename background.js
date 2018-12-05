chrome.contextMenus.create({
  "id": "Wikit",
  "title": "Wikit",
  "contexts": ["selection"]
});

chrome.contextMenus.create({
  "id": "Export",
  "title": "Export"
});

chrome.contextMenus.onClicked.addListener(function(clickData){
    if (clickData.menuItemId == "Export"){
      var newURL = "http://stackoverflow.com/";
      chrome.tabs.create({ url: newURL });
    } else if (clickData.menuItemId == "Wikit" && clickData.selectionText){
        console.log('selected');
    }
});


