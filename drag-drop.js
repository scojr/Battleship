const shipDrawerEl = document.querySelector('.ship-drawer.modal');
const shipEls = shipDrawerEl.querySelectorAll('.player-ship');
const visualEl = document.querySelector('.drag-drop-visual');
let currentShip;
let hoveredCell;


shipEls.forEach((ship) => {
  ship.addEventListener('mousedown', (e) => initiateDragging(e, ship));
})


function initiateDragging(event, ship) {
  event.preventDefault();
  event.stopPropagation();
  currentShip = ship;
  currentShip.style.visibility = 'hidden';
  newGrabVisual(currentShip.dataset.length, event);
  document.onmousemove = drag;
  document.onmouseup = endDrag;
}

function drag(event) {
  const elementFromPoint = document.elementFromPoint(event.pageX, event.pageY);
  cellHovered(elementFromPoint);
  moveVisualElToCursor(event);
}

function endDrag() {
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;
  newGrabVisual(false);
  currentShip.style.visibility = 'visible';
  currentShip = null;
}

function newGrabVisual(length, event) {
  visualEl.innerHTML = '';
  if (!length) return;
  for (let i = 0; i < length; i++) {
    const visualCellEl = document.createElement('div')
    visualCellEl.classList.add('cell');
    visualEl.append(visualCellEl);
  }
  moveVisualElToCursor(event)
}

function moveVisualElToCursor(event) {
  visualEl.style.setProperty('--mouse-x', `${event.clientX - visualEl.offsetWidth / 2}px`)
  visualEl.style.setProperty('--mouse-y', `${event.clientY - visualEl.offsetHeight / 2}px`)
}

function cellHovered(element) {
  if (element.classList.contains('cell') && element !== hoveredCell) {
    hoveredCell = element;
    console.log(hoveredCell);
  }
}