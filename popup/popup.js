/*页面元素id*/
let id_label_root = "popup_root_view";
let id_label_drawer = "popup_left_drawer";
let id_label_card = "page_info_card";
let class_label_card = `.${id_label_card}`;

/**
 * 是否展示弹窗了
 * @type {boolean}
 */
let isPopupShow = false

/**
 * 向html中插入popup
 */
function insertPopupHtml() {




    const popupRootView = document.createElement('div');
    popupRootView.id = 'popup_root_view';
    popupRootView.onclick = onRootViewClick;

    const popupLeftDrawer = document.createElement('div');
    popupLeftDrawer.id = 'popup_left_drawer';

    popupRootView.appendChild(popupLeftDrawer);

    document.body.appendChild(popupRootView);

    testData()
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
            // item.classList.add("choice");
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
            // item.classList.remove("choice");
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
function forceHidePopup(hasAnim) {
    if (hasAnim) {
        changeVisible(false)
        return
    }
    isPopupShow = false
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
    container_root.addEventListener("scroll", calculationCenterWidget);
    container_root.addEventListener("wheel", calculationStopScroll,true);
    window.addEventListener("resize", onWindowSizeChange)
    document.addEventListener('scroll', calculationPopupPositionInWindow,true);
}

/**
 * 当popup关闭的时候移除监听器
 */
function removeNecessaryEventListener() {
    let container_root = document.getElementById(id_label_root);
    container_root.removeEventListener("scroll", calculationCenterWidget);
    container_root.removeEventListener("wheel", calculationStopScroll,true);
    window.removeEventListener("resize", onWindowSizeChange)
    document.removeEventListener('scroll', calculationPopupPositionInWindow,true);
}

/**
 * 设置popup动画属性
 * @param isShow true弹出，false关闭
 * @param isClear 如果是true 将不会add新的动画，只会移除。所以要完全移除，调用两次这个方法
 */
function setPopupAnimTag(isShow, isClear) {

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

    if (!isClear) {
        container_root.classList.add(`popup_root_${addTag}_class`);
        document.getElementById(id_label_drawer).classList.add(`popup_drawer_${addTag}_class`);
    }

}

/**
 * 改变可见性
 */
function changeVisible(needShow) {
    isPopupShow = needShow;
    let container_root = document.getElementById(id_label_root);
    if (container_root == null) {
        insertPopupHtml();
        container_root = document.getElementById(id_label_root);
    }


    let isShowing = container_root.classList.contains("popup_root_show_class");
    //通过是否有show属性派判断容器是否已经在展示了。同时判断是否需要显示，这样放置逻辑多次触发。
    if (isShowing && !needShow) {
        /*hide*/
        console.log("HIDE")
        /*关闭的时候需要监听结束 这个操作和 removeNecessaryEventListener逻辑相反。所以不能一起操作*/
        container_root.addEventListener('animationend', onPopupCloseAnimEnd);
        /*必要的监听器移除*/
        removeNecessaryEventListener();
        setPopupAnimTag(false)
    } else if (!isShowing && needShow) {
        /*show*/
        console.log("SHOW")
        /*show的时候不需要关闭动画 这个操作和 addNecessaryEventListener逻辑相反。所以不能一起操作*/
        container_root.removeEventListener('animationend', onPopupCloseAnimEnd);
        /*必要的监听器添加*/
        addNecessaryEventListener();

        setPopupAnimTag(true)

        //主动触发窗口的改变
        onWindowSizeChange();

        container_root.setAttribute('tabindex', '0');
    }
}

//当快捷键按下的时候触发
function onKeyDown(event){
    function show() {
        changeVisible(true);
    }

    //todo 平台判断

    let platformButton = event.altKey
    let triggerKey = "w"

    if (platformButton && event.key === triggerKey) {
        show();
    } else if (isPopupShow && event.key === triggerKey) {
        //再次按下打开对应的ui，这个时候就需要强制隐藏了
        forceHidePopup(false)
        //todo open
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
    container_root.style.top = Math.abs(bodyTop) + "px"
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
    console.log(root_view.offsetHeight+"----"+windowHalfSize)
    root_view.style.marginTop = `${windowHalfSize}px`
    root_view.style.marginBottom = `${windowHalfSize}px`
}


function testData() {
    for (let i = 0; i < 5; i++) {
        addItem("id_" + i)
    }
}

/**
 * 抽屉item点击事件
 */
function onDrawerItemClick(event) {
    // 阻止事件冒泡
    event.stopPropagation();
    scrollToItem(this.id)
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
 * 滚动到对应的item位置
 */
function scrollToItem(itemId) {
    let container_root = document.getElementById(id_label_root);
    let windowHalfSize = window.innerHeight / 2;
    let item = document.getElementById(itemId);
    let offsetTop = item.getBoundingClientRect().top + (item.offsetHeight / 2);
    console.log(container_root)
    smoothScrollPx(container_root, Math.floor(offsetTop - windowHalfSize))
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
        let scrollTop = startPosition + (endPosition - startPosition) * easeOutQuad(progress);
        console.log(scrollTop)
        scrollView.scrollTop = scrollTop; // 设置新的滚动位置
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
 *        <div class="page_info_card_button" onclick="onOpenBtnClick()"> &#10132;</div>
 *    </div>
 *    <img alt="image" class="page_info_card_img" onload="style.display = 'block'" src="https://via.placeholder.com/320x150.png?text=no%20review" >
 *   </div>
 * `
 *
 * @param boxId 为item设置id
 * @param title 网站标题
 * @param imgSrc 网站截图base64
 */
function addItem(boxId, title, imgSrc) {
    // 创建一个新的div元素
    let item = document.createElement("div");
    item.id = boxId;
    // 给新的div元素设置class属性
    item.className = id_label_card;
    item.onclick = onDrawerItemClick

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
        //todo 测试
        let closetParent = event.target.closest(class_label_card);
        removeItem(closetParent.id)
    })


    //操作打开按钮
    let open_btn = document.createElement("div");
    open_btn.className = "page_info_card_button"
    open_btn.style.backgroundColor = "#2196F3"
    open_btn.innerHTML = `&#10132;`
    open_btn.addEventListener("click", (event) => {
        // event.stopPropagation();
        let closetParent = event.target.closest(class_label_card);
        scrollToItem(closetParent.id)
        //todo
    })

    desc_container.append(desc, delete_btn, open_btn)

    //展示预览画面img
    let card_img = document.createElement("img")
    card_img.alt = "image"
    card_img.className = "page_info_card_img"
    card_img.onload = (iv) => {
        iv.target.style.display = "block"
    }
    card_img.onerror = (iv) => {
        let url = brower.runtime.getUrl("popup/no_preview.png");
        console.log(url)
    }
    card_img.src = imgSrc

    item.append(desc_container, card_img)


    document.getElementById(id_label_drawer).appendChild(item);
}

/**
 * 移除
 * @param boxId 要删除的item id
 */
function removeItem(boxId) {
    // 找到要删除的 div 元素
    let divToRemove = document.getElementById(boxId);
    // 如果找到了该 div 元素，则从列表中移除它
    if (divToRemove) {
        document.getElementById(id_label_drawer).removeChild(divToRemove);
    }
    calculationCenterWidget()
}


document.addEventListener('keydown', onKeyDown);

//
// async function getMaxZIndex() {
//     // 获取 body 元素和所有 Element 类型的子元素
//     const body = document.body;
//     const elements = body.getElementsByTagName('*');
//     console.log(elements.length)
//     let maxZIndex = -Infinity;
//
//     // 遍历所有子元素，检查其 z-index 属性
//     for (let i = 0; i < elements.length; i++) {
//         const element = elements[i];
//         if (element instanceof Element) {
//             const zIndex = parseInt(getComputedStyle(element).getPropertyValue('z-index'));
//             if (!isNaN(zIndex)) {
//                 maxZIndex = Math.max(maxZIndex, zIndex);
//             }
//         }
//     }
//
//     return maxZIndex;
// }
//
// // 调用函数
//  getMaxZIndex().then((value)=>{
//      console.log("value = "+value);
//  });



async function getMaxZIndex() {
    const elements = document.body.getElementsByTagName('*');
    const map = new Map();
    let maxZIndex = -Infinity;
    let currentIndex = 0;
    const taskCount = 8;
    const batchSize = Math.ceil(elements.length / taskCount);

    // 预处理元素属性值
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element instanceof Element ) {
            const zIndex = parseInt(getComputedStyle(element).getPropertyValue('z-index'));
            if (!isNaN(zIndex)) {
                map.set(element, zIndex);
            }
        }
    }

    // 并行处理元素
    const tasks = Array.from({ length: taskCount }, () => []);
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (map.has(element)) {
            tasks[i % taskCount].push(element);
        }
    }

    const promises = tasks.map(async (group) => {
        let maxZIndex = -Infinity;
        for (const element of group) {
            const zIndex = map.get(element);
            if (zIndex !== undefined) {
                maxZIndex = Math.max(maxZIndex, zIndex);
            }
        }
        return maxZIndex;
    });

    const results = await Promise.all(promises);
    for (const result of results) {
        maxZIndex = Math.max(maxZIndex, result);
    }

    return maxZIndex;
}

// 调用函数
getMaxZIndex().then((maxZIndex) => {
    console.log(maxZIndex);
});

