console.log("content 脚本加入")
function onCaptured(imageUri) {

    console.log(imageUri);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

browser.tabs.captureVisibleTab(browser.windows.WINDOW_ID_CURRENT,{ format: 'png', quality: 100 }).then(onCaptured);
