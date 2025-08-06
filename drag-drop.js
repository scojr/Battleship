import { getCellEl, updateGameboards } from "./dom-controller.js";

const shipDrawerEl = document.querySelector('.ship-drawer.modal');
const shipEls = shipDrawerEl.querySelectorAll('.player-ship');
const visualEl = document.querySelector('.drag-drop-visual');

let players;
let currentShip;
let previousCells;
let hoveredCell;
let isValid;
let validCellParams;

class ShipDragging {
  constructor(player, el, fromDrawer = false) {
    this.player = player;
    this.el = el;
    this.fromDrawer = fromDrawer;
    if (fromDrawer) {
      this.length = parseInt(el.dataset.length);
    }
    if (!fromDrawer) {
      this.cellX = parseInt(el.dataset.x);
      this.cellY = parseInt(el.dataset.y);
      this.object = getShipObject(player, this.cellX, this.cellY)
      this.rotation = this.object.rotation;
      this.startX = this.object.start[0];
      this.startY = this.object.start[1];
      this.length = parseInt(this.object.length);
    }
    function getShipObject(player, x, y) {
      const object = player.gameboard.getCell(x, y);
      return object
    }

  }

  getCells() {
    if (this.fromDrawer) return;
    const cells = [];
    for (let i = 0; i < this.length; i++) {
      cells.push(getCellEl(this.startX + i, this.startY));
    }
    return cells;
  }
  hideShip() {
    if (this.fromDrawer) return;
    const cells = this.getCells();
    cells.forEach((cell) => {
      cell.classList.add('hidden');
    })
  }
  showShip() {
    if (this.fromDrawer) return;
    const cells = this.getCells();
    cells.forEach((cell) => {
      cell.classList.remove('hidden');
    })
  }
}

export function getPlayersForShipPlacement(playersObject) {
  players = playersObject;
}

export function shipDragHandler(ship) {
  ship.addEventListener('mousedown', (e) => {
    currentShip = new ShipDragging(players['1'], ship);
    newGrabVisual(currentShip.length, e);
    initiateDragging(e, ship);
  });
}

function drawerDragHandler(ship) {
  ship.addEventListener('mousedown', (e) => {
    currentShip = new ShipDragging(players['1'], ship, true);
    newGrabVisual(currentShip.length, e);
    initiateDragging(e, ship);
  });
}

shipEls.forEach((ship) => drawerDragHandler(ship));

function initiateDragging(event) {
  event.preventDefault();
  event.stopPropagation();
  isValid = false;
  currentShip.hideShip();
  if (currentShip.fromDrawer) currentShip.el.classList.add('picked');
  document.onmousemove = drag;
  document.onmouseup = endDrag;
}

function drag(event) {
  const elementFromPoint = document.elementFromPoint(event.pageX, event.pageY);
  if (elementFromPoint) {
    if (elementFromPoint.classList.contains('cell') && elementFromPoint !== hoveredCell) {
      hoveredCell = elementFromPoint;
      isValid = testCellValidity();
    }
    if (elementFromPoint.classList.contains('gameboards')) {
      isValid = false;
      styleCells();
    }
  }
  moveVisualElToCursor(event);
}

function endDrag() {
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;
  if (isValid) {
    if (!currentShip.fromDrawer) {
      players['1'].gameboard.removeShip(currentShip.cellX, currentShip.cellY);
    }
    players['1'].gameboard.placeShip(...validCellParams)
  } else if (currentShip.fromDrawer) {
    currentShip.el.classList.remove('picked');
  }
  newGrabVisual(false);
  currentShip = null;
  updateGameboards(players)
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
    if (cell.classList.contains('ship') && !cell.classList.contains('hidden')) isValid = false;
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
  const shipLength = parseInt(currentShip.length);
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
  const cellEls = [];
  const cellObjects = [];
  for (let i = firstCellToTest; i <= lastCellToTest; i++) {
    cellEls.push(getCellEl(i, inactiveAxis))
    cellObjects.push(players['1'].gameboard.getCell(i, inactiveAxis))
  }
  validCellParams = [firstCellToTest, inactiveAxis, shipLength];
  return cellEls;
}
