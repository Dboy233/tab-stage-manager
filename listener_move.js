let isAltPressed = false;
let startX, startY;

document.addEventListener('keydown', event => {
  if (event.keyCode === 18) { // keyCode 18 is for Alt key
    isKeyboardPressed = true;
  }
});

document.addEventListener('keyup', event => {
  if (event.keyCode === 18) {
    isKeyboardPressed = false;
    startX = undefined;
    startY = undefined;
  }
});

document.addEventListener('mousemove', event => {
  if (!isKeyboardPressed) return;

  if (startX === undefined && startY === undefined) {
    startX = event.clientX;
    startY = event.clientY;
    return;
  }

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  console.log(`Mouse gesture detected: horizontal=${deltaX}, vertical=${deltaY}`);

  startX = event.clientX;
  startY = event.clientY;
});
