import { clickHandler } from "./click-handler.js";

const elements = {
  gameboardContainer: document.querySelector('.gameboard-container'),
  playerGrid: document.querySelector('.player.grid'),
  opponentGrid: document.querySelector('.opponent.grid'),
  displayHeader: document.querySelector('.display .header'),
  displayMessage: document.querySelector('.display p'),
}

export function toggleGridOverlay(toggle = false) {
  toggle = !toggle;
  if (toggle) {
    elements.playerGrid.classList.add('inactive');
    elements.opponentGrid.classList.remove('inactive');
  } else {
    elements.opponentGrid.classList.add('inactive');
    elements.playerGrid.classList.remove('inactive');
  }
}

export const displayInterface = {
  updateHeader: function (string) {
    elements.displayHeader.textContent = string;
  },
  updateMessage: function (string) {
    elements.displayMessage.textContent = string;
  }
}

drawBoard();

function drawBoard() {
  fillGrids(elements.playerGrid, 'primary');
  fillGrids(elements.opponentGrid, 'opponent');
}

function fillGrids(element, name) {
  for (let i = 0; i < 100; i++) {
    let x = i;
    let y = Math.floor(i / 10);
    const cell = document.createElement('div');
    cell.addEventListener('click', e => clickHandler(e.target, name))
    cell.classList.add('cell', name, `x${x % 10}`, `y${y}`)
    cell.dataset.x = x % 10;
    cell.dataset.y = y;
    element.append(cell);
  }
}

export function refreshGrids(gameObject) {
  refreshGrid(gameObject.player1.gameboard, elements.playerGrid);
  refreshGrid(gameObject.player2.gameboard, elements.opponentGrid);
  function refreshGrid(player, gridElement) {
    const grid = player.getGrid();
    let x = null;
    let y = null;
    grid.forEach((row, index) => {
      y = index;
      row.forEach((cell, index) => {
        x = index
        if (cell.has().ship) gridElement.querySelector(`.x${x}.y${y}`).classList.add("ship");
      })
    })
  }
}