

chrome.runtime.onMessage.addListener(
    function (response, sender, sendResponse) {
        console.log("Msg received!" + response.type);
        console.log("Msg received!" + response.data.menuItemId);
        console.log("Msg received!" + response.data.pageUrl);
        console.log("Msg received!" + response.data.parentMenuItemId);
        console.log("Msg received!" + response.data.selectionText);
        alert("Msg received!" + response.data.selectionText);
        sendResponse("sucess");
    });