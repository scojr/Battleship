import { getCellEl, updateGameboards } from "./dom-controller.js";

const shipDrawerEl = document.querySelector('.ship-drawer.modal');
const shipDrawerContentEl = shipDrawerEl.querySelector('.modal-content');
const shipEls = shipDrawerEl.querySelectorAll('.player-ship');
const visualEl = document.querySelector('.drag-drop-visual');

let players;
let activePlayer;
let currentShip;
let previousCells;
let hoveredCell;
let isValid;
let validCellParams;
let draggingEnabled = false;
let shipsPlaced = 0;
let onShipsPlaced;
let moved = false;

function allowDragging(bool) {
  draggingEnabled = bool;
}

function reset() {
  shipsPlaced = 0;
  const drawerShips = shipDrawerContentEl.querySelectorAll('.player-ship');
  drawerShips.forEach((ship) => ship.classList.remove('picked'));
}

class ShipDragging {
  constructor(player, el, fromDrawer = false) {
    this.player = player;
    this.el = el;
    this.fromDrawer = fromDrawer;
    if (fromDrawer) {
      this.length = parseInt(el.dataset.length);
      this.rotation = false;
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
      let axis = { x: this.startX + i, y: this.startY };
      if (this.rotation) axis = { x: this.startX, y: this.startY + i };
      cells.push(getCellEl(activePlayer, axis.x, axis.y));
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

export function initiateShipPlacement(
  playersObject, player, callbackOnShipsPlaced
) {
  players = playersObject;
  activePlayer = player;
  onShipsPlaced = callbackOnShipsPlaced;
  draggingEnabled = true;
  reset();
  shipDrawerVisibility(true, activePlayer);
}

export function endShipPlacement() {
  allowDragging(false);
  shipDrawerVisibility(false);
}

export function shipDragHandler(ship) {
  ship.addEventListener('mousedown', (e) => {
    currentShip = new ShipDragging(players[activePlayer], ship);
    initiateDragging(e, ship);
  });
}

function drawerDragHandler(ship) {
  ship.addEventListener('mousedown', (e) => {
    currentShip = new ShipDragging(players[activePlayer], ship, true);
    initiateDragging(e, ship);
    newGrabVisual(currentShip.length, e);
  });
}

shipEls.forEach((ship) => drawerDragHandler(ship));

function initiateDragging(event) {
  if (!draggingEnabled) return;
  event.preventDefault();
  event.stopPropagation();
  isValid = false;
  if (currentShip.fromDrawer) currentShip.el.classList.add('picked');
  document.onmousemove = drag;
  document.onmouseup = endDrag;
}

function drag(event) {
  currentShip.hideShip();
  newGrabVisual(currentShip.length, event);
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
  moved = true;
  moveVisualElToCursor(event);
}

function endDrag() {
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;
  if (!moved && !currentShip.fromDrawer) {
    rotateShip();
  }
  if (isValid) {
    if (!currentShip.fromDrawer) {
      players[activePlayer].gameboard.removeShip(currentShip.cellX, currentShip.cellY);
      shipsPlaced--;
    }
    players[activePlayer].gameboard.placeShip(...validCellParams);
    shipsPlaced++;
    if (shipsPlaced >= 5) onShipsPlaced();
  } else if (currentShip.fromDrawer) {
    currentShip.el.classList.remove('picked');
  }
  newGrabVisual(false);
  moved = false;
  currentShip = null;
  updateGameboards(players);
}

function newGrabVisual(length, event) {
  visualEl.innerHTML = '';
  if (currentShip.rotation) visualEl.classList.remove('flex', 'column');
  if (!length) return;
  if (currentShip.rotation) visualEl.classList.add('flex', 'column');
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
  currentShip.rotation ? activeAxis = hoveredCellY : activeAxis = hoveredCellX;
  currentShip.rotation ? inactiveAxis = hoveredCellX : inactiveAxis = hoveredCellY;
  const shipLength = parseInt(currentShip.length);
  let firstCellToTest = Math.round((parseInt(activeAxis) - parseInt(shipLength) / 2));
  let lastCellToTest = Math.round((parseInt(activeAxis) + parseInt(shipLength) / 2) - 1);
  console.log(hoveredCellX, hoveredCellY);
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
  const cellCoords = []
  const cellEls = [];
  for (let i = 0; i < currentShip.length; i++) {
    let cell = { x: firstCellToTest + i, y: hoveredCellY };
    if (currentShip.rotation) cell = { x: hoveredCellX, y: firstCellToTest + i };
    cellCoords.push([cell.x, cell.y]);
    cellEls.push(getCellEl(activePlayer, cell.x, cell.y))
  }
  validCellParams = [cellCoords[0][0], cellCoords[0][1], shipLength, currentShip.rotation];
  console.log(cellCoords);
  return cellEls;
}

function shipDrawerVisibility(bool, player) {
  shipDrawerContentEl.classList.remove('player-1');
  shipDrawerContentEl.classList.remove('player-2');
  let value = 'visible'
  if (!bool) value = 'hidden';
  shipDrawerContentEl.classList.add(`player-${player}`);
  shipDrawerEl.style.visibility = value;
}

function rotateShip() {
  players[activePlayer].gameboard.removeShip(currentShip.cellX, currentShip.cellY);
  const placeAttempt = players[activePlayer].gameboard.placeShip(currentShip.startX, currentShip.startY, currentShip.length, !currentShip.rotation);
  if (!placeAttempt) players[activePlayer].gameboard.placeShip(currentShip.startX, currentShip.startY, currentShip.length, currentShip.rotation);
}