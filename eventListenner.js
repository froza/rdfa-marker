chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.parentMenuItemId == "itemSubject" && clickData.selectionText) {
        if (clickData.selectionText) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "itemSubject", data: clickData }, function (response) {
                    console.log(response);
                });
            });
        }

        if (clickData.parentMenuItemId == "itemPredicate" && clickData.selectionText) {
            if (clickData.selectionText) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: "itemPredicate", data: clickData }, function (response) {
                        console.log(response);
                    });
                });
            }
        }

        if (clickData.parentMenuItemId == "itemObject" && clickData.selectionText) {
            if (clickData.selectionText) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: "itemObject", data: clickData }, function (response) {
                        console.log(response);
                    });
                });
            }
        }
    }
});