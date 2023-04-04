// noinspection JSUnresolvedVariable,JSDeprecatedSymbols

/**
 * 获取当前window的所有tab信息
 */
async function getCurrentWindowTabInfo(portId) {
    function createInfo(tab) {
        // let img = await platformHandle.captureTab(tab.id)
        return {
            tabId: tab.id,
            title: tab.title,
            isActive: tab.active,
            url: tab.url,
            // img: img,
        }
    }

    let tabs = await browser.tabs.query({
        "currentWindow": true
    })

    let list = [];
    for (let tab of tabs) {
        list.push(createInfo(tab))
    }
    sendMsg(portId, "msg_result_all_tabs", {
        success: true,
        tabs: list,
    })
}


/**
 * 打开标签
 * @param portId 端口id
 * @param tabId tab id
 */
function openTab(portId, tabId) {
    browser.tabs.update(
        parseInt(tabId),
        {active: true}
    ).then(() => {
        sendMsg(portId, "msg_result_open_tab", {
            tabId: tabId,
            success: true
        })
    }).catch((e) => {
        sendMsg(portId, "msg_result_open_tab", {
            tabId: tabId,
            success: false
        })
    })
}

/**
 * 移除某个标签
 * @param portId 端口id
 * @param tabId 标签id
 */
function removeTab(portId, tabId) {
    browser.tabs.remove(
        parseInt(tabId)
    ).then(() => {
        sendMsg(portId, "msg_result_remove_tab", {
            success: true,
            tabId: tabId,
        })
    }).catch((e) => {
        sendMsg(portId, "msg_result_remove_tab", {
            success: false,
            tabId: tabId,
        })
    })
}


//=============================消息接收=====================
/**
 * 端口id->port 字典表
 * @type {Map<any, any>}
 */
let portMap = new Map();

/**
 * 发送数据
 * @param portId 端口id
 * @param msg 消息事件
 * @param data 任意object数据
 */
function sendMsg(portId, msg, data) {
    // console.log("发送消息", portId, msg, data)
    if (portMap.has(portId)) {
        portMap.get(portId).postMessage({
            msg: msg,
            data: data
        })
    }
}


function onMsgEvent(msg) {
    // console.log("收到消息:", msg)
    switch (msg.msg) {
        case "msg_request_all_tabs":
            getCurrentWindowTabInfo(msg.portId).then()
            break
        case "msg_request_remove_tab":
            removeTab(msg.portId, msg.data.tabId)
            break
        case "msg_request_open_tab":
            openTab(msg.portId, msg.data.tabId)
            break
    }
}

function onDisConnectEvent(port) {
    portMap.delete(port.name)
    console.warn(port)
}


function connected(port) {
    // console.log("链接:", port)
    portMap.set(port.name, port)
    port.onMessage.addListener(onMsgEvent);
    port.onDisconnect.addListener(onDisConnectEvent);
}

browser.runtime.onConnect.addListener(connected);

//====================心跳任务==================
//保持后台脚本的活跃状态，从而保证程序的正常运行

/**
 * 创建延迟alarm
 */
function createDelayAlarm() {
    let when = Date.now() + 3000;
    browser.alarms.create("IAlmostFellAsleep", {when: when});
}

/**
 * 随机端口通信
 */
function randomPortCommunicate(){
    let ports = portMap.values();
    //随机一个port进行心跳通信。
    let index = Math.floor(Math.random() * portMap.size);
    let port;
    while (index >= 0) {
        let next = ports.next();
        port = next.value;
        if (next.done) {
            break;
        } else {
            index--;
        }
    }
    if (port) {
        port.postMessage({
            msg: "IAlmostFellAsleep"
        });
    }
}

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "IAlmostFellAsleep") {
        randomPortCommunicate()
        //创建延迟alarm
        createDelayAlarm();
    }
});

//创建延迟alarm
createDelayAlarm();
