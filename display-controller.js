const elements = {
  gameboardContainer: document.querySelector('.gameboard-container'),
  playerGrid: document.querySelector('.player.grid'),
  opponentGrid: document.querySelector('.opponent.grid'),
  opponentHealth: document.querySelector('.score .opponent.text'),
  playerHealth: document.querySelector('.score .opponent.text'),
  displayHeader: document.querySelector('.display .title'),
  displayMessage: document.querySelector('.display .message'),
}

const scoreInterface = {
  updatePlayerScore: function (value) {
    elements.playerHealth.textContent = value;
  },
  updateOpponentScore: function (value) {
    elements.opponentHealth.textContent = value;
  },
}

const displayInterface = {
  updateHeader: function (string) {
    elements.displayHeader.textContent = string;
  },
  updateMessage: function (string) {
    elements.displayHeader.textContent = string;
  }
}

export function drawBoard() {
  fillGrids(elements.playerGrid, 'player');
  fillGrids(elements.opponentGrid, 'opponent');
}

function fillGrids(element, name) {
  for (let i = 0; i < 100; i++) {
    let x = i;
    let y = Math.floor(i / 10);
    const cell = document.createElement('div');
    cell.addEventListener('click', e => cellClick(e.target, name))
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

function cellClick(cell, name) {
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  console.log(name, x, y);
}