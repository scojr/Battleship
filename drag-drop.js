import { getCellEl } from "./dom-controller.js";

const shipDrawerEl = document.querySelector('.ship-drawer.modal');
const shipEls = shipDrawerEl.querySelectorAll('.player-ship');
const visualEl = document.querySelector('.drag-drop-visual');
let currentShip;
let hoveredCell;
let previousCells;


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
  if (elementFromPoint.classList.contains('cell') && elementFromPoint !== hoveredCell) {
    hoveredCell = elementFromPoint;
    console.log(testCellValidity());
    console.log('test')
  }
  moveVisualElToCursor(event);
}

function endDrag() {
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;
  styleCells();
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

function testCellValidity() {
  if (!hoveredCell) return;
  let isValid = true;
  const cells = getCellsToTest();
  for (let cell of cells) {
    if (cell.classList.contains('ship')) isValid = false;
  }
  styleCells(cells, isValid);
  previousCells = cells;
  return isValid;
}

function styleCells(cells, bool) {
  if (previousCells) {
    previousCells.forEach((cell) => {
      cell.classList.remove('invalid');
      cell.classList.remove('valid');
      cell.classList.remove('hovered');
    })
  }
  if (cells) {
    cells.forEach((cell) => {
      cell.classList.add('hovered');
      if (bool) cell.classList.add('valid');
      else cell.classList.add('invalid');
    })
  }
}

function getCellsToTest() {
  const hoveredCellX = parseInt(hoveredCell.dataset.x);
  const hoveredCellY = parseInt(hoveredCell.dataset.y);
  let activeAxis = hoveredCellX;
  let inactiveAxis = hoveredCellY;
  const shipLength = parseInt(currentShip.dataset.length);
  let firstCellToTest = Math.round((parseInt(activeAxis) - parseInt(shipLength) / 2));
  let lastCellToTest = Math.round((parseInt(activeAxis) + parseInt(shipLength) / 2) - 1);
  if (firstCellToTest < 0) {
    const difference = 0 - firstCellToTest;
    firstCellToTest += difference;
    lastCellToTest += difference;
  }
  if (lastCellToTest > 10) {
    const difference = lastCellToTest - 10;
    firstCellToTest -= difference;
    lastCellToTest -= difference;
  }
  const cellCoords = [];
  for (let i = firstCellToTest; i <= lastCellToTest; i++) {
    console.log(i, inactiveAxis)
    cellCoords.push(getCellEl(i, inactiveAxis))
  }
  console.log(cellCoords);
  return cellCoords;
}