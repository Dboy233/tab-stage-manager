
//键盘监听按键
let keyboardlistenerKey = 'Control';

//遮罩View
let mask_view_id = 'mask_view'
let mask_view = document.createElement('div')
mask_view.id = mask_view_id

//访问历史视图View
let history_view_id = 'history_view'
let history_view = document.createElement('div');
history_view.id = history_view_id;

//是否按下键盘
let isKeyboardPressed = false;
//鼠标起始坐标
let startX, startY;

//历史控件位移位置
let history_view_org_X = 0
let history_view_org_Y = 0

//是否执行位移
let doMove = false;

//修改遮罩View的可见性
function changeMaskVisibility(v) {
  let view = document.getElementById(mask_view_id);
  view.style.visibility = isKeyboardPressed ? 'visible' : 'collapse';
}

//移动控件
function doMode(dx, dy) {
  console.log("x = " + dx + "  y=" + dx);
  history_view_org_X = history_view_org_X + dx;
  history_view_org_Y = history_view_org_Y + dy;
  if (history_view_org_X < 0) {
    history_view_org_X = 0;
  }
  if (history_view_org_Y < 0) {
    history_view_org_Y = 0;
  }
  let view = document.getElementById(history_view_id);
  view.style.left = history_view_org_X + 'px';
  view.style.top = history_view_org_Y + 'px';
}

//鼠标移动位置监听并计算
document.addEventListener('mousemove', function (event) {
  if (!isKeyboardPressed) return;

  if (startX === undefined && startY === undefined) {
    startX = event.clientX;
    startY = event.clientY;
    return;
  }

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  if (doMove) {
    doMode(deltaX, deltaY);
  }

  startX = event.clientX;
  startY = event.clientY;
});

document.addEventListener('mousedown', e => {
  if (e.button === 0 && isKeyboardPressed) {
    doMove = true;
  }
});


//监听鼠标左键抬起
document.addEventListener('mouseup', e => {
  if (e.button === 0) {
    doMove = false;
  }
});

//监听鼠标左键落下
document.addEventListener('keydown', event => {
  console.log(event);
  if (event.key == keyboardlistenerKey) {
    isKeyboardPressed = true;
    changeMaskVisibility();
  }
});

//监听键盘按键
document.addEventListener('keyup', event => {
  if (event.key == keyboardlistenerKey) {
    isKeyboardPressed = false;
    changeMaskVisibility();
  }
});

//=====================插入视图html css============================

let body = document.getElementsByTagName('body')[0];

let mask_view_style = `
#${mask_view_id}{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #0000001f;
  visibility: collapse;
  z-index: 9999;
}
`;
let mask_view_html = `
<div id="${mask_view_id}"></div>
`;

let mask_view_css = document.createElement('style');
mask_view_css.innerHTML = mask_view_style;

body.insertAdjacentHTML('beforeend', mask_view_html);

body.appendChild(mask_view_css);


let history_style = `
#${history_view_id} {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  background-color: yellow;
  z-index: 9999;
}`;

let history_view_html = `<div id="${history_view_id}"></div>`;

let history_view_css = document.createElement('style');
history_view_css.innerHTML = history_style;

body.insertAdjacentHTML('beforeend', history_view_html);

body.appendChild(history_view_css);
