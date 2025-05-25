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
    cell.classList.add('cell', name, `x${x}`, `y${y}`)
    element.append(cell)
  }
}
