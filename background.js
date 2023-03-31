// noinspection JSUnresolvedVariable,JSDeprecatedSymbols


import './background-firefox.js';

// console.log("===="+tabReviewMap)


if (typeof browser === "undefined"){
     var browser = chrome;
}

browser. aaprent()

// let name_space = browser;

let windowMap = new Map();

let detachedTabTemp = [];


function onTabCreate(tab, tabPosition, windowId) {
    // console.log(`onTabCreate : ${tab.id}-${tabPosition}-${windowId}`)

    const wId = (typeof windowId === "undefined") ? tab.windowId : windowId;

    const index = (typeof tabPosition === "undefined") ? tab.index : tabPosition;

    let target_window_tabs;
    if (windowMap.has(wId)) {
        target_window_tabs = windowMap.get(wId);
    } else {
        target_window_tabs = []
        windowMap.set(wId, target_window_tabs);
    }
    //长度等于下表那就是末尾累加
    if (target_window_tabs.length === index) {
        //末尾累加
        target_window_tabs.push(tab)
    } else if (target_window_tabs.length > index) {
        //插入
        target_window_tabs.splice(index, 0, tab)
    }
    // console.log(target_window_tabs.map(value => value.id).join(","))
}

function onTabRemoved(tabId, removeInfo) {
    let windowId = removeInfo.windowId;
    // console.log(`Tab: ${tabId} closing ， window id ${windowId}, window close ${removeInfo.isWindowClosing}`);
    if (!windowMap.has(windowId)) {
        console.log("没有这个window");
        return;
    }
    let tabs = windowMap.get(windowId);
    if (removeInfo.isWindowClosing) {
        tabs.splice(0, tabs.length);
        windowMap.delete(windowId);
        return;
    }
    //倒着遍历这样更安全
    for (let i = tabs.length - 1; i >= 0; i--) {
        if (tabs[i].id === tabId) {
            //移除
            tabs.splice(i, 1)
            break;
        }
    }
}

function onTabMoved(tabId, moveInfo) {
    let fromIndex = moveInfo.fromIndex;
    let toIndex = moveInfo.toIndex;
    // console.log(`Tab ${tabId} moved from ${fromIndex} to ${toIndex}`);

    function remove(tab) {
        let windowId = tab.windowId;
        if (!windowMap.has(windowId)) {
            return;
        }
        let tabs = windowMap.get(windowId);
        //交换位置
        [tabs[fromIndex], tabs[toIndex]] = [tabs[toIndex], tabs[fromIndex]]
        console.log(tabs.map(value => value.id).join(","))
    }

    browser.tabs.get(tabId).then(remove)
}

function onAttachedNewWindow(tabId, attachInfo) {
    let newWindowId = attachInfo.newWindowId;
    let newPosition = attachInfo.newPosition;
    // console.log(`Tab: ${tabId} attached`);
    // console.log(`New window: ${newWindowId}`);
    // console.log(`New index: ${newPosition}`);

    let tab = null;

    for (let i = detachedTabTemp.length - 1; i >= 0; i--) {
        let detachedTabTempElement = detachedTabTemp[i];
        if (detachedTabTempElement.id === tabId) {
            tab = detachedTabTempElement;
            detachedTabTemp.splice(i, 1);
            break;
        }
    }

    if (tab == null) {
        return;
    }

    onTabCreate(tab, newPosition, newWindowId);
}

function onTabDetached(tabId, detachInfo) {
    let oldWindowId = detachInfo.oldWindowId;
    let oldPosition = detachInfo.oldPosition;
    if (!windowMap.has(oldWindowId)) {
        console.log("旧的窗口不存在")
        return;
    }
    let tabs = windowMap.get(oldWindowId);
    //fix
    let detached = tabs.splice(oldPosition, 1);
    console.log(windowMap.get(oldWindowId).map(t => t.id).join(","))
    detachedTabTemp.push(detached[0]);
    //old
    // for (let i = tabs.length - 1; i >= 0; i--) {
    //     let tab = tabs[i];
    //     if (tab.id === tabId) {
    //         tabs.splice(i, 1);
    //         console.log(windowMap.get(oldWindowId).map(t => t.id).join(","))
    //         detachedTabTemp.push(tab);
    //         return;
    //     }
    // }
}

function onTabActivated(activeInfo) {
    console.log(`windows ${activeInfo.windowId}, Tab ${activeInfo.tabId} 激活, Tab ${activeInfo.previousTabId}`);
}


// 监听tab事件
browser.tabs.onCreated.addListener(onTabCreate);
browser.tabs.onRemoved.addListener(onTabRemoved)
browser.tabs.onMoved.addListener(onTabMoved)
browser.tabs.onAttached.addListener(onAttachedNewWindow)
browser.tabs.onDetached.addListener(onTabDetached)
browser.tabs.onActivated.addListener(onTabActivated)



browser.runtime.onInstalled.addListener(() => {
    browser.tabs.query({}).then(tabs => {
        for (let mTab of tabs) {
            onTabCreate(mTab);
        }
    })
});




browser.action.onClicked.addListener( () => {
    console.log(tabReviewMap)
    function onCaptured(imageUri) {
        // formatImg(imageUri,600);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    // browser.tabs.captureVisibleTab(browser.windows.WINDOW_ID_CURRENT,{ format: 'jpeg', quality: 50 }).then(onCaptured,onError);

});

//可能不用
function formatImg(base64,reWidth){
    console.log("格式化图片")
    // 创建一个Image对象
    var img = new Image();

// 设置图片的src属性为base64格式的字符串
    img.src = base64;

// 等待图片加载完成后执行操作
    img.onload = function() {
        // 创建一个Canvas元素
        var canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        console.log("img width "+ width)
        console.log("img height "+ height)
        // 设置Canvas的宽高
        canvas.width = reWidth;
        canvas.height = (height/width)*reWidth;

        // canvas.width = width;
        // canvas.height = height;

        // 获取Canvas的2D上下文
        var ctx = canvas.getContext('2d');

        // 绘制图片到Canvas上
        ctx.drawImage(img, 0, 0, canvas.width,canvas.height);

        // 将Canvas转化为base64格式的图片
        var resizedImg = canvas.toDataURL();
        console.log(resizedImg)
    };

}


