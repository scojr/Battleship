import { startGame } from "./game-logic.js";

const devButton = document.querySelector('.dev-button');

export function devButtonOnClick(callback) {
  devButton.onclick = callback;
}

const gameboardsEl = document.querySelector('.gameboards');

const playerBoards = {
  1: document.querySelector('.gameboard.player-1'),
  2: document.querySelector('.gameboard.player-2'),
}

const newGameModalEl = document.querySelector('.new-game.modal')
const intermissionModalEl = document.querySelector('.intermission.modal');

const newGameButtonEls = {
  'playCpu': document.querySelector('.play-cpu'),
  'playFriend': document.querySelector('.play-friend'),
}

const headerMessage = document.querySelector('.header-message');

newGameButtonEls.playCpu.addEventListener('click', () => {
  startGame(true);
  closeNewGameModal();
})
newGameButtonEls.playFriend.addEventListener('click', () => {
  startGame(true);
  closeNewGameModal();
})

function closeNewGameModal() {
  newGameModalEl.style.visibility = 'hidden';
}

export function updateGameboards(players) {
  playerBoards['1'].innerHTML = '';
  playerBoards['2'].innerHTML = '';
  const player1 = players['1'];
  const player2 = players['2'];

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

export function hideGameboard(player) {
  playerBoards[1].classList.remove('hidden')
  playerBoards[2].classList.remove('hidden')
  gameboardsEl.classList.remove('hidden')

  if (!player) return;
  let elToHide;
  if (player === 1) elToHide = playerBoards[1];
  if (player === 2) elToHide = playerBoards[2];
  if (player === 3) elToHide = gameboardsEl;
  elToHide.classList.add('hidden');
}

export function showIntermission(message) {
  const messageEl = intermissionModalEl.querySelector('.intermission-message');
  messageEl.textContent = message;
  hideGameboard(3);
  intermissionModalEl.style.visibility = 'visible';
}

export function newHeaderMessage(string) {
  headerMessage.textContent = string;
}