chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "jquery-3.5.1.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "QrCode.js" }, function() {
            chrome.tabs.executeScript({file: 'content_script-2.js'});
        });
    });
});