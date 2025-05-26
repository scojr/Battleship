const gameboardContainer = document.querySelector('.gameboard-container')
const playerGrid = gameboardContainer.querySelector('.player.grid');
const opponentGrid = gameboardContainer.querySelector('.opponent.grid');

export function drawBoard() {
  fillGrids(playerGrid, 'player');
  fillGrids(opponentGrid, 'opponent');
}

function fillGrids(element, name) {
  for (let i = 0; i < 100; i++) {
    let x = i;
    let y = Math.floor(i / 10);
    const cell = document.createElement('div');
    cell.addEventListener('click', e => {
      console.log("test");
    })
    cell.classList.add('cell', 'empty', name, `x${x % 10}`, `y${y}`)
    cell.dataset.x = x % 10;
    cell.dataset.y = y;
    element.append(cell);
  }
}

export function refreshPlayerGrid(gameboardObject) {
  const playerCells = playerGrid.querySelectorAll('.cell');
  const grid = gameboardObject.getGrid();
  let x = null;
  let y = null;

  grid.forEach((row, index) => {
    y = index;
    row.forEach((cell, index) => {
      x = index
      if (cell.has().ship) playerGrid.querySelector(`.x${x}.y${y}`).classList.add("has-ship");
    })
  })
}