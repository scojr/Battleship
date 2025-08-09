import { startGame } from "./game-logic.js";
import { shipDragHandler } from "./drag-drop.js";

const gameboardsEl = document.querySelector('.gameboards');

const playerBoards = {
  1: document.querySelector('.gameboard.player-1'),
  2: document.querySelector('.gameboard.player-2'),
}

let cellEls = [];

export function cellsOnClick(callback) {
  cellEls.forEach((cell) => {
    cell.onclick = callback;
  })
}

const newGameModalEl = document.querySelector('.new-game.modal')
const messageModalEl = document.querySelector('.message.modal');

const newGameButtonEls = {
  'playCpu': document.querySelector('.play-cpu'),
  'playFriend': document.querySelector('.play-friend'),
}

const messageButtonEl = document.querySelector('.message-button');

messageButtonEl.addEventListener('click', (e) => {
  messageModalEl.style.visibility = 'hidden';
})

const continueButtonEl = document.querySelector('button.continue');

function continueButtonOnClick(callback) {
  continueButtonEl.onclick = callback;
}
function continueButtonMessage(message) {
  continueButtonEl.textContent = message;
}
function disableContinueButton() {
  continueButtonEl.classList.add('inactive');
}
function enableContinueButton() {
  continueButtonEl.classList.remove('inactive');
}

function hideContinueButton() {
  continueButtonEl.style.visibility = 'hidden';
}

function showContinueButton() {
  continueButtonEl.style.visibility = 'visible';
}

export const continueButtonControls = {
  onClick: continueButtonOnClick,
  message: continueButtonMessage,
  disable: disableContinueButton,
  enable: enableContinueButton,
  hide: hideContinueButton,
  show: showContinueButton,
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

let highlightedCell;
export function highlightCell(cellEl) {
  if (highlightedCell) highlightedCell.classList.remove('targeted');
  cellEl.classList.add('targeted');
  highlightedCell = cellEl;
}

export function updateGameboards(players) {
  cellEls = [];
  playerBoards['1'].innerHTML = '';
  playerBoards['2'].innerHTML = '';
  const player1 = players['1'];
  const player2 = players['2'];

  insertGrid(player1, playerBoards['1']);
  insertGrid(player2, playerBoards['2']);

  function insertGrid(player, gameboardEl) {
    player.gameboard.grid.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.classList.add('row', 'flex', `row-${rowIndex}`);
      row.forEach((cell, cellIndex) => {
        const cellEl = document.createElement('div');
        cellEl.dataset.x = cellIndex;
        cellEl.dataset.y = rowIndex;
        cellEl.classList.add('cell', `cell-${cellIndex}`);
        player.gameboard.recievedAttacks.forEach((miss) => {
          if (parseInt(miss.x) == cellIndex && parseInt(miss.y) == rowIndex) {
            if (miss.isHit) cellEl.classList.add('hit');
            else cellEl.classList.add('miss');
          }
        })
        if (cell) {
          cellEl.classList.add('ship')
          shipDragHandler(cellEl);
        }
        cellEls.push(cellEl);
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

export function showMessage(topMessage, bottomMessage, buttonMessage) {
  const messageTopEl = messageModalEl.querySelector('.message-message-top');
  const messageBottomEl = messageModalEl.querySelector('.message-message-bottom');
  const buttonSpanEl = messageModalEl.querySelector('.confirm-text.message');
  messageTopEl.textContent = topMessage;
  messageBottomEl.textContent = bottomMessage;
  messageBottomEl.textContent = bottomMessage;
  buttonMessage ? buttonSpanEl.textContent = buttonMessage : buttonSpanEl.textContent = 'Confirm';
  hideGameboard(3);
  messageModalEl.style.visibility = 'visible';
}

export function newHeaderMessage(string) {
  headerMessage.textContent = string;
}

export function getCellEl(player, x, y) {
  const board = document.querySelector(`.gameboard.player-${player}`)
  const row = board.querySelector(`.row-${y}`);
  const cell = row.querySelector(`.cell-${x}`);
  return cell;
}