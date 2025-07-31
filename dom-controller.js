import { startGame } from "./game-logic.js";

const gameboardsEl = document.querySelector('.gameboards');

const playerBoards = {
  1: document.querySelector('.gameboard.player-1'),
  2: document.querySelector('.gameboard.player-2'),
}

const newGameModalEl = document.querySelector('.new-game.modal')

const newGameButtonEls = {
  'playCpu': document.querySelector('.play-cpu'),
  'playFriend': document.querySelector('.play-friend'),
}

newGameButtonEls.playCpu.addEventListener('click', () => {
  startGame();
  closeNewGameModal();
})
newGameButtonEls.playFriend.addEventListener('click', () => {
  startGame();
  closeNewGameModal();
})

function closeNewGameModal() {
  newGameModalEl.style.visibility = 'hidden';
}

export function updateGameboards(player1, player2) {
  playerBoards['1'].innerHTML = '';
  playerBoards['2'].innerHTML = '';

  insertGrid(player1, playerBoards['1']);
  insertGrid(player2, playerBoards['2']);

  function insertGrid(player, gameboardEl) {
    const grid = document.createElement('div');
    player.gameboard.grid.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.classList.add('row', 'flex');
      row.forEach((cell) => {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        if (cell) {
          cellEl.classList.add('ship')
          if (cell.hits > 0) cellEl.classList.add('ship hit')
        }
        rowEl.append(cellEl);
      })
      gameboardEl.append(rowEl);
    })
  }
}

export function gameboardDisplayControl(bool, player) {
  let elToHide = gameboardsEl;
  if (player === 1) elToHide = playerBoards[1];
  if (player === 2) elToHide = playerBoards[2];
  if (bool) elToHide.classList.remove('hidden');
  else elToHide.classList.add('hidden');
}