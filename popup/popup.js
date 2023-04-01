console.log("popup_js")



/*页面元素id*/
let id_label_root = "popup_root_view";
let id_label_drawer = "popup_left_drawer";
let id_label_card = "page_info_card";
let class_label_card = `.${id_label_card}`;

//距离屏幕中心最近的Box
let closestBox = null;

/*页面Element*/
let container_root = document.getElementById(id_label_root);
let container_left_drawer = document.getElementById(id_label_drawer);



function insertPopupHtml(){
    const popupRootView = document.createElement('div');
    popupRootView.id = 'popup_root_view';

    const popupLeftDrawer = document.createElement('div');
    popupLeftDrawer.id = 'popup_left_drawer';

    popupRootView.appendChild(popupLeftDrawer);

    document.body.appendChild(popupRootView);
}


function removePopupHtml(){
    document.getElementById()
}



/**
 * 修改盒子被选中时的大小
 * @param box 被选中的盒子
 */
function changeBoxSize(box) {
    document.querySelectorAll(class_label_card).forEach(function (item) {
        if (item === box) {
            item.classList.add("choice");
        } else {
            item.classList.remove("choice");
        }
    })
}

/**
 * 改变可见性
 */
function changeVisible(needShow) {
    let container_root = document.getElementById(id_label_root);
    let isShow = container_root.classList.contains("show");
    if (isShow && !needShow) {
        container_root.classList.remove("show");
        container_left_drawer.classList.remove("show");
    } else if (!isShow && needShow) {
        container_root.classList.toggle("show");
        container_left_drawer.classList.toggle("show");
    }
}

document.addEventListener('keydown', event => {
    if (event.key === "a") {
        changeVisible(true)
    }
});

document.addEventListener('keyup', event => {
    if (event.key === "a") {
        changeVisible(false)
    }
});


/**
 * 窗口发生变化
 */
function onWindowSizeChange() {
    resizeDrawerMargin();
    /*重新计算重新box*/
    calculationCenterWidget();
}

/**
 * 计算中心位置widget
 */
function calculationCenterWidget() {

    let container_root =  document.getElementById(id_label_root)

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
        console.log("最近的元素是：", closestBox.id);
        // console.log("距离屏幕中心的距离是：", minDistance);
    }
}

window.addEventListener("resize", onWindowSizeChange)
container_root.addEventListener("scroll", calculationCenterWidget);


/**
 * 重新计算抽屉的上下预留边距，这样为了帮正每一个box都可以被居中显示
 */
function resizeDrawerMargin() {
    /* 计算屏幕一般高度大小 */
    let windowHalfSize = window.innerHeight / 2;
    //当box被选中的时候高度变化最终值
    //todo 不能写死
    let lastBoxHeight = 100;
    let fixMargin = 0;

    do {
        fixMargin += lastBoxHeight;
    } while (fixMargin + lastBoxHeight < windowHalfSize)

    container_left_drawer.style.paddingTop = `${fixMargin}px`
    container_left_drawer.style.paddingBottom = `${fixMargin}px`
}

//test
for (let i = 0; i < 3; i++) {
    let newCard = document.createElement("div");
    newCard.innerText = "card" + i;
    newCard.id = id_label_card + i;
    // newCard.onclick = changeBoxSize;
    newCard.classList.add(id_label_card);
    container_left_drawer.appendChild(newCard);
}


let testId = "test_add"

function addBox() {
    let newCard = document.createElement("div");
    newCard.innerText = "card add";
    newCard.id = testId;
    // newCard.onclick = changeBoxSize;
    newCard.classList.add(id_label_card);
    container_left_drawer.appendChild(newCard);

}

function removeBox() {

    // 找到要删除的 div 元素
    let divToRemove = document.getElementById(testId);
    // 如果找到了该 div 元素，则从列表中移除它
    if (divToRemove) {
        container_left_drawer.removeChild(divToRemove);
    }
}


onWindowSizeChange();

