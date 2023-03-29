let history_view = document.getElementById('tracker');

function doMode(e) {
  let x = e.clientX;
  let y = e.clientY;
  history_view.style.left = (x - 50) + 'px';
  history_view.style.top = (y - 50) + 'px';
}

document.addEventListener('mousedown', function(e) {
  history_view.style.display = 'block';
  document.addEventListener('mousemove', doMode);
});

document.addEventListener('mouseup', function(e) {
  history_view.style.display = 'none';
  document.removeEventListener('mousemove', doMode);
});
