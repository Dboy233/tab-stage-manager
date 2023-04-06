/*页面元素id*/
let id_label_root = "popup_root_view";
let id_label_drawer = "popup_left_drawer";
let id_label_card = "page_info_card";
let class_label_card = `.${id_label_card}`;

/**
 * 最大z-index值。popup的值+1
 * 我都这个数值了应该没有比这个大的了。
 * @type {number}
 */
let maxZIndex = 999999


/**
 * 向html中插入popup
 */
function insertPopupHtml() {

    const popupRootView = document.createElement('div');
    popupRootView.id = 'popup_root_view';
    popupRootView.onclick = onRootViewClick;
    popupRootView.style.zIndex = maxZIndex.toString()

    const popupLeftDrawer = document.createElement('div');
    popupLeftDrawer.id = 'popup_left_drawer';

    popupRootView.appendChild(popupLeftDrawer);

    document.body.appendChild(popupRootView);

}

/**
 * 移除popup的html内容
 */
function removePopupHtml() {
    let container_root = document.getElementById(id_label_root);
    document.body.removeChild(container_root)
}


/**
 * 修改盒子被选中时的大小
 * @param box 被选中的盒子
 */
function changeBoxSize(box) {
    document.querySelectorAll(class_label_card).forEach(function (item) {
        let rect = item.getBoundingClientRect();
        let width = rect.width;
        if (item === box) {
            item.animate([
                {
                    "width": `${width}px`,
                },
                {
                    "width": `532px`,
                }
            ], {
                duration: 200,
                easing: 'ease-in-out',
                fill: "forwards"
            })
        } else {
            if (width === 444) return
            item.animate([
                {
                    "width": `${width}px`,
                },
                {
                    "width": `444px`,
                }
            ], {
                duration: 200,
                easing: 'ease-in-out',
                fill: "forwards"
            })
        }
    })
}

/**
 * 窗口关闭的时候移除所有的popup相关的html
 */
function onPopupCloseAnimEnd() {
    let container_root = document.getElementById(id_label_root);
    if (container_root) {
        container_root.removeEventListener('animationend', onPopupCloseAnimEnd);
        removePopupHtml();
    }
}

/**
 * 强制关闭popup
 */
function forceHidePopup() {
    if (!isPopupShow) {
        // console.log("不需要强制hide")
        return;
    }
    isPopupShow = false;
    //移除所有动画
    setPopupAnimTag(false, true);
    setPopupAnimTag(true, true)
    //移除监听器
    removeNecessaryEventListener();
    //最后移除popup内容
    removePopupHtml()
}

/**
 * 当popup打开的时候设置必要的监听器
 */
function addNecessaryEventListener() {
    let container_root = document.getElementById(id_label_root);
    container_root.addEventListener("scroll", calculationCenterWidget, true);
    container_root.addEventListener("wheel", calculationStopScroll, true);
    window.addEventListener("resize", onWindowSizeChange)
    document.addEventListener('scroll', calculationPopupPositionInWindow);
}

/**
 * 当popup关闭的时候移除监听器
 */
function removeNecessaryEventListener() {
    let container_root = document.getElementById(id_label_root);
    container_root.removeEventListener("scroll", calculationCenterWidget);
    container_root.removeEventListener("wheel", calculationStopScroll);
    window.removeEventListener("resize", onWindowSizeChange)
    document.removeEventListener('scroll', calculationPopupPositionInWindow);
}

/**
 * 设置popup动画属性
 * @param isShow true弹出，false关闭
 * @param dontAddNewAnim 如果是true 将不会add新的动画，只会移除。所以要完全移除，调用两次这个方法
 */
function setPopupAnimTag(isShow, dontAddNewAnim) {

    let addTag;
    let removeTag

    if (isShow) {
        addTag = "show";
        removeTag = "hide";
    } else {
        addTag = "hide"
        removeTag = "show"
    }
    let container_root = document.getElementById(id_label_root);

    container_root.classList.remove(`popup_root_${removeTag}_class`);
    document.getElementById(id_label_drawer).classList.remove(`popup_drawer_${removeTag}_class`);

    if (!dontAddNewAnim) {
        container_root.classList.add(`popup_root_${addTag}_class`);
        document.getElementById(id_label_drawer).classList.add(`popup_drawer_${addTag}_class`);
    }

}

/**
 * popup是否已经被显示
 * @type {boolean}
 */
let isPopupShow = false

/**
 * 改变可见性
 */
function changeVisible(needShow) {
    if (isPopupShow === needShow) {
        // console.log("不须要改变可见性", needShow)
        return
    }
    isPopupShow = needShow;
    let container_root = document.getElementById(id_label_root);
    if (container_root == null) {
        insertPopupHtml();
        container_root = document.getElementById(id_label_root);
    }

    let isShowing = container_root.classList.contains("popup_root_show_class");
    //通过是否有show属性派判断容器是否已经在展示了。同时判断是否需要显示，这样防止逻辑多次触发。
    if (isShowing && !needShow) {
        /*hide*/
        /*关闭的时候需要监听结束 这个操作和 removeNecessaryEventListener逻辑相反。所以不能一起操作*/
        container_root.addEventListener('animationend', onPopupCloseAnimEnd);
        /*必要的监听器移除*/
        removeNecessaryEventListener();
        /*设置hide动画*/
        setPopupAnimTag(false)
    } else if (!isShowing && needShow) {
        /*show*/
        /*show的时候不需要关闭动画 这个操作和 addNecessaryEventListener逻辑相反。所以不能一起操作*/
        container_root.removeEventListener('animationend', onPopupCloseAnimEnd);
        /*必要的监听器添加*/
        addNecessaryEventListener();
        /*设置添加动画*/
        setPopupAnimTag(true)
        //调整大小和位置
        onWindowSizeChange();
    }
}


/**
 * 窗口发生变化
 */
function onWindowSizeChange() {
    /* 计算屏幕一般高度大小 */
    let windowHalfSize = window.innerHeight;
    let root_view = document.getElementById(id_label_root);
    root_view.style.height = `${windowHalfSize}px`;

    /*调整位置*/
    calculationPopupPositionInWindow()
    /*设置边距*/
    resizeDrawerMargin();
    /*重新计算重新box*/
    calculationCenterWidget();
}

/**
 * 计算弹窗位于窗口的位置.当浏览器滚动的时候保持popup在用户界面
 */
function calculationPopupPositionInWindow() {
    let bodyTop = document.body.getBoundingClientRect().top;
    let container_root = document.getElementById(id_label_root);
    if (container_root) {
        container_root.style.top = Math.abs(bodyTop) + "px";
    }
}


/**
 * 计算并阻止滚动
 * @param event
 */
function calculationStopScroll(event) {

    let deltaY = event.deltaY;
    let allBox = document.querySelectorAll(class_label_card)
    if (deltaY < 0) {
        /*向上滚动*/
        if (allBox.length !== 0) {
            let first = allBox[0];
            if (first === closestBox) {
                event.preventDefault();
            }
        }
    } else {
        /*向下滚动*/
        if (allBox.length !== 0) {
            let last = allBox[allBox.length - 1];
            if (last === closestBox) {
                event.preventDefault()
            }
        }
    }
}

//距离屏幕中心最近的Box
let closestBox = null;

/**
 * 计算中心位置widget
 */
function calculationCenterWidget() {

    let container_root = document.getElementById(id_label_root);
    /* 计算屏幕中心 */
    let windowHeight = window.innerHeight;
    let scrollTop = container_root.scrollTop;
    let screenCenter = scrollTop + windowHeight / 2;

    /* 遍历所有的元素，找到距离屏幕中心最近的那个 */
    let minDistance = Infinity;
    let captureBox = null;

    /*检查所有盒子中心位置距离*/
    let allBox = document.querySelectorAll(class_label_card);
    for (let i = 0; i < allBox.length; i++) {
        let box = allBox[i]
        let boxTop = box.getBoundingClientRect().top + scrollTop;
        let boxBottom = boxTop + box.clientHeight;
        let boxCenter = (boxTop + boxBottom) / 2;
        let distance = Math.abs(screenCenter - boxCenter);
        if (distance < minDistance) {
            captureBox = box;
            minDistance = distance;
        } else {
            /*当检测到第一个偏离中心的box就停止循环*/
            break
        }
    }

    /* 在控制台输出距离屏幕中心最近的元素信息 */
    if (captureBox !== null && captureBox !== closestBox) {
        closestBox = captureBox;
        changeBoxSize(closestBox)
        // console.log("最近的元素是：", closestBox.id);
        // console.log("距离屏幕中心的距离是：", minDistance);
    }
}

/**
 * 重新计算抽屉的上下预留边距，这样为了帮正每一个box都机会可以被居中显示
 */
function resizeDrawerMargin() {
    /* 计算屏幕一般高度大小 */
    let windowHalfSize = window.innerHeight / 2;
    let root_view = document.getElementById(id_label_drawer);
    root_view.style.marginTop = `${windowHalfSize}px`
    root_view.style.marginBottom = `${windowHalfSize}px`
}


/**
 * 跟布局点击
 */
function onRootViewClick(event) {
    //强制关闭popup但是有动画
    changeVisible(false);
    // 阻止事件冒泡
    event.stopPropagation();
}

/**
 * 查找卡片通过标签id
 * @param tabId 标签id
 * @param callback 回调
 */
function queryCardByTabId(tabId, callback) {
    let cards = document.querySelectorAll(class_label_card);
    for (let card of cards) {
        if (parseInt(card.dataset.id) === parseInt(tabId)) {
            callback(card)
            return
        }
    }
    callback(undefined)
}


/**
 * 滚动到对应的item位置
 */
function scrollToItem(tabId) {
    let container_root = document.getElementById(id_label_root);
    let windowHalfSize = window.innerHeight / 2;

    queryCardByTabId(tabId, (card) => {
        if (card) {
            let offsetTop = card.getBoundingClientRect().top + (card.offsetHeight / 2);
            smoothScrollPx(container_root, Math.floor(offsetTop - windowHalfSize))
        }
    })

}

/**
 * 像素的平滑滚动
 * @param scrollView 需要滚动的View
 * @param scrollPx 滚动多少像素
 */
function smoothScrollPx(scrollView, scrollPx) {
    const scrollDistance = scrollPx; // 滚动距离

    const duration = 150; // 持续时间（毫秒）

    const startTime = Date.now(); // 起始时间
    const startPosition = scrollView.scrollTop; // 起始位置
    const endPosition = startPosition + scrollDistance; // 结束位置

    function smoothScroll() {
        const elapsed = Date.now() - startTime; // 已经过的时间
        const progress = Math.min(elapsed / duration, 1); // 滚动进度

        const easeOutQuad = (t) => t * (2 - t); // 缓动函数（这里使用了缓出二次函数）

        // 新的滚动位置
        scrollView.scrollTop = startPosition + (endPosition - startPosition) * easeOutQuad(progress); // 设置新的滚动位置
        if (progress < 1) { // 如果还未达到指定的持续时间，则继续滚动
            requestAnimationFrame(smoothScroll);
        }
    }

    requestAnimationFrame(smoothScroll); // 开始滚动

}

/**
 *  `
 *  <div id="??" class="page_info_card">
 *    <div class="page_info_card_desc_container">
 *        <div class="page_info_card_desc">
 *           网站名字
 *        </div>
 *        //removeBtn
 *        //goBtn
 *        <div class="page_info_card_button" onclick="onOpenBtnClick()"> &#10132;</div>
 *    </div>
 *    <img alt="image" class="page_info_card_img" onload="style.display = 'block'" src="https://via.placeholder.com/320x150.png?text=no%20review" >
 *   </div>
 * `
 *
 * @param tabId 为item设置id
 * @param title 网站标题
 * @param imgSrc 网站截图base64
 */
function addItem(tabId, title, imgSrc) {
    // 创建一个新的div元素
    let item = document.createElement("div");
    item.className = id_label_card;
    item.dataset.id = tabId
    item.onclick = (event) => {
        event.stopPropagation();
        let closetParent = event.target.closest(class_label_card);
        scrollToItem(closetParent.dataset.id)
    }

    //内容+操作=容器
    let desc_container = document.createElement("div")
    desc_container.className = "page_info_card_desc_container"

    //页面标题
    let desc = document.createElement("div");
    desc.className = "page_info_card_desc"
    desc.innerText = title
    //操作 删除按钮
    let delete_btn = document.createElement("div")
    delete_btn.className = "page_info_card_button"
    delete_btn.style.backgroundColor = "#e91e63"
    delete_btn.innerHTML = `&#10006`
    delete_btn.addEventListener("click", (event) => {
        event.stopPropagation();
        let closetParent = event.target.closest(class_label_card);
        sendRemoveTab(closetParent.dataset.id)
    }, true)

    //操作打开按钮
    let open_btn = document.createElement("div");
    open_btn.className = "page_info_card_button"
    open_btn.style.backgroundColor = "#2196F3"
    open_btn.innerHTML = `&#10132;`
    open_btn.addEventListener("click", (event) => {
        event.stopPropagation();
        let closetParent = event.target.closest(class_label_card);
        sendOpenTab(closetParent.dataset.id)
        // showOrHide();
    }, true)

    desc_container.append(desc, delete_btn, open_btn)

    //展示预览画面img
    let card_img = document.createElement("img")
    card_img.alt = "image"
    card_img.className = "page_info_card_img"
    card_img.onload = (iv) => {
        // console.log("onload", iv)
        iv.target.style.display = "block"
    }
    card_img.onerror = (iv) => {
        // let url = brower.runtime.getUrl("popup/no_preview.png");
        // console.log("onerror", iv)
    }
    // card_img.src = imgSrc

    item.append(desc_container, card_img)


    document.getElementById(id_label_drawer).appendChild(item);
}

/**
 * 设置item的预览图片
 * @param id tabId
 * @param imgSrc 图片base64
 */
function setItemImg(id, imgSrc) {

}

/**
 * 移除
 * @param tabId 要删除的item id
 */
function removeItem(tabId) {
    // 找到要删除的 div 元素
    queryCardByTabId(tabId, (card) => {
        if (card) {
            document.getElementById(id_label_drawer).removeChild(card);
        }
    })
    //重新计算中心位置
    calculationCenterWidget()
}


/**
 * 获取网页上最大的z-index，popup的z轴要确保在最顶层。
 * @returns {Promise<null|number>}
 */
async function getMaxZIndex() {
    // console.time("getMaxZIndex")
    let maxZIndex = -Infinity;
    const styleSheets = document.styleSheets;
    const rulesWithZIndex = [];

    for (const styleSheet of styleSheets) {
        let rules = [];
        try {
            rules = styleSheet.cssRules || styleSheet.rules || [];
        } catch (e) {
            console.warn(e)
            continue;
        }

        for (const rule of rules) {
            if (rule.type === CSSRule.STYLE_RULE && rule.style.zIndex !== "") {
                rulesWithZIndex.push(parseInt(rule.style.zIndex));
            }
        }
    }


    function insertionSort(arr, start, end) {
        for (let i = start + 1; i <= end; i++) {
            let j = i;
            while (j > start && arr[j] < arr[j - 1]) {
                [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
                j--;
            }
        }
    }

    function merge(arr, aux, low, mid, high) {
        let i = low;
        let j = mid + 1;

        for (let k = low; k <= high; k++) {
            aux[k] = arr[k];
        }

        for (let k = low; k <= high; k++) {
            if (i > mid) {
                arr[k] = aux[j++];
            } else if (j > high) {
                arr[k] = aux[i++];
            } else if (aux[j] < aux[i]) {
                arr[k] = aux[j++];
            } else {
                arr[k] = aux[i++];
            }
        }
    }

    //timeSort算法.来自chatgpt
    function timSort(arr) {
        const minRunLength = 32;
        const n = arr.length;
        const aux = new Array(n);

        for (let i = 0; i < n; i += minRunLength) {
            insertionSort(arr, i, Math.min(i + minRunLength - 1, n - 1));
        }

        for (let size = minRunLength; size < n; size *= 2) {
            for (let left = 0; left < n; left += 2 * size) {
                const mid = left + size - 1;
                const right = Math.min((left + 2 * size - 1), (n - 1));

                if (mid < right) {
                    merge(arr, aux, left, mid, right);
                }
            }
        }

        return arr;
    }

    //获取最大值
    if (rulesWithZIndex.length > 0) {
        timSort(rulesWithZIndex)
        maxZIndex = parseInt(rulesWithZIndex[rulesWithZIndex.length - 1]);
    }
    // console.timeEnd("getMaxZIndex")
    return maxZIndex === -Infinity ? null : maxZIndex;
}

//执行获取最大z-index操作
getMaxZIndex().then((max) => {
    if (max != null) {
        //大一个就行
        maxZIndex = Math.max(max + 1, maxZIndex);
    }
})

function getRandomMsgId() {
    const min = 0;
    const max = 1000;
    //通过两次随机完全防止发生重复几率而且一正一负更不容易相同。希望如此
    let id1 = Math.floor(Math.random() * (max - min)) + min;
    let id2 = -Math.floor(Math.random() * (max - min)) + min;

    return `popup_page_id-${id1}${id2}`;
}

//=====================快捷键====================


function showOrHide() {
    if (isPopupShow) {
        changeVisible(false)
    } else {
        changeVisible(true);
    }
}

/**
 * 快捷键触发
 * @param event 事件
 * @param platformKey 不同平台对应的不同触发按键
 */
function onKeyDown(event, platformKey) {
    if (platformKey && event.key === hotKey) {
        //发送获取所有tab信息请求。
        sendGetAllTabs();
    } else if (isPopupShow && event.key === hotKey) {
        //发送打开tab请求。
        sendOpenTab(closestBox.dataset.id)
    }
}

/**
 * 快捷键按键,默认未定义,由不同平台设置
 * @type {undefined}
 */
let hotKey = undefined;

function onWinKeyDown(event) {
    if (hotKey === undefined) {
        hotKey = "w";
        console.log("Win 默认快捷键 Alt+w")
    }
    onKeyDown(event, event.altKey, hotKey)
}

function onMacKeyDown(event) {
    //默认为e
    if (hotKey === undefined) {
        console.log("Mac 默认快捷键 command+e")
        hotKey = "e";
    }
    onKeyDown(event, event.metaKey, hotKey)
}

/**
 * 监听按键
 */
function listenerKey() {
    //不同平台使用不同的按键
    if (navigator.platform.toUpperCase().includes("MAC")) {
        document.removeEventListener('keydown', onMacKeyDown)
        document.addEventListener('keydown', onMacKeyDown)
    } else {
        document.removeEventListener('keydown', onWinKeyDown)
        document.addEventListener('keydown', onWinKeyDown);
    }
}

/**
 * 获取快捷键
 */
function getHotKey() {
    browser.storage.sync.get('hot_key').then((res) => {
        if (res.hot_key) {
            hotKey = res.hot_key;
        } else {
            console.log("未定义快捷键")
        }
        listenerKey();
    }).catch((e) => {
        console.log("获取hotkey失败")
        listenerKey()
    });
}

getHotKey()

//存储设置发生改变监听
browser.storage.onChanged.addListener((changes, area) => {
    getHotKey()
});


//=====================消息接收================================
/**
 * js消息通知id
 * @type {string}
 */
const popupPortId = getRandomMsgId();

//注册消息通道
const popupPort = browser.runtime.connect({"name": popupPortId});

/**
 * 是否已经请求所有tab信息.信息量过大可能会产生延迟。防止多次请求
 * @type {boolean}
 */
let isRequestAllTabs = false;

//接收消息
popupPort.onMessage.addListener(function (msg) {
    switch (msg.msg) {
        case "msg_result_all_tabs":
            //得到所有tab信息，接下来就是展示了
            isRequestAllTabs = false;
            //正在活动的窗口
            let activeTab = null;
            //显示popup
            showOrHide();
            //添加tab
            msg.data.tabs.forEach((tab) => {
                addItem(tab.tabId, tab.title)
                if (tab.isActive) {
                    activeTab = tab;
                }
            })
            if (activeTab != null) {
                scrollToItem(activeTab.tabId)
            }
            break;
        case "msg_result_open_tab":
            if (msg.data.force) {
                forceHidePopup();
            } else {
                changeVisible(false);
            }
            break
        case "msg_result_remove_tab":
            //删除某个标签事件状态
            if (msg.data.success) {
                removeItem(msg.data.tabId)
            }
            break
        case "IAlmostFellAsleep":
            //后台检查通信
            // console.log("砰～砰～")
            break
        default:
            console.warn("no msg handle", msg.msg)
    }
});

/**
 * 发送获取所有tabs信息
 */
function sendGetAllTabs() {
    if (isRequestAllTabs) return;
    isRequestAllTabs = true;
    sendMsg("msg_request_all_tabs")
}

function sendRemoveTab(tabId) {
    sendMsg("msg_request_remove_tab", {
        tabId: tabId
    })
}

function sendOpenTab(tabId) {
    sendMsg("msg_request_open_tab", {
        tabId: tabId,
    })
}


function sendMsg(msg, data) {
    // console.log("发送消息", msg, data)
    popupPort.postMessage({
        portId: popupPortId,
        msg: msg,
        data: data,
    })
}
