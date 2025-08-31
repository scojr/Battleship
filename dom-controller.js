import { startGame } from "./game-logic.js";
import { shipDragHandler } from "./drag-drop.js";

const playerBoards = {
  1: document.querySelector('.gameboard.player-1'),
  2: document.querySelector('.gameboard.player-2'),
}

let shipsVisible = true;
let cellEls = [];
let isCPU = false;

export function cellsOnClick(callback) {
  cellEls.forEach((cell) => {
    cell.onclick = callback;
  })
}

const newGameModalEl = document.querySelector('.new-game.modal')
const messageContainerEl = document.querySelector('.message-container');

const newGameButtonEls = {
  'playCpu': document.querySelector('.play-cpu'),
  'playFriend': document.querySelector('.play-friend'),
}

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
  continueButtonEl.style.display = 'none';
}

function showContinueButton() {
  continueButtonEl.style.display = 'block';
}

function movePlayerButton(playerNum) {
  continueButtonEl.classList.remove('player-1', 'player-2');
  if (!playerNum) return;
  if (playerNum == 1) continueButtonEl.classList.add('player-1')
  if (playerNum == 2) continueButtonEl.classList.add('player-2')
}

export const continueButtonControls = {
  onClick: continueButtonOnClick,
  message: continueButtonMessage,
  disable: disableContinueButton,
  enable: enableContinueButton,
  hide: hideContinueButton,
  show: showContinueButton,
  move: movePlayerButton,
}

const headerMessage = document.querySelector('.header-message');

newGameButtonEls.playCpu.addEventListener('click', () => {
  startGame(true, true);
  closeNewGameModal();
  isCPU = true;
})
newGameButtonEls.playFriend.addEventListener('click', () => {
  startGame(true);
  closeNewGameModal();
  isCPU = false;
})

function closeNewGameModal() {
  newGameModalEl.style.visibility = 'hidden';
}

let highlightedCell;
export function highlightCell(cellEl, isCPU) {
  if (highlightedCell) highlightedCell.classList.remove('targeted', 'cpu');
  cellEl.classList.add('targeted');
  if (isCPU) cellEl.classList.add('CPU');
  highlightedCell = cellEl;
}

export function updateGameboards(players) {
  cellEls = [];
  playerBoards['1'].innerHTML = '';
  playerBoards['2'].innerHTML = '';
  const player1 = players['1'];
  const player2 = players['2'];

  insertGrid(player1, playerBoards['1'], 1);
  insertGrid(player2, playerBoards['2'], 2);

  function insertGrid(player, gameboardEl, playerNum) {
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
          cellEl.classList.add('ship');
          if (!shipsVisible) cellEl.classList.add('hidden');
          else if (shipsVisible && isCPU && playerNum == 2) cellEl.classList.add('hidden');
          if (cell.hits == cell.length) {
            cellEl.classList.add('destroyed');
            cellEl.classList.remove('hidden')
          };
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

  if (!player) return;
  let elToHide;
  if (player === 1) playerBoards[1].classList.add('hidden');
  if (player === 2) playerBoards[2].classList.add('hidden');
  if (player === 3) {
    playerBoards[1].classList.add('hidden');
    playerBoards[2].classList.add('hidden');
  }
}

export function disableBoardInteraction(player, bool) {
  const board = playerBoards[player];
  if (bool) board.classList.add('disable');
  else board.classList.remove('disable');
}

export function showMessage(topMessage, bottomMessage, playerNum) {
  messageContainerEl.classList.remove('player-1', 'player-2')
  if (!topMessage) {
    messageContainerEl.style.display = 'none';
    return;
  }
  if (playerNum) messageContainerEl.classList.add(`player-${playerNum}`)
  const messageTopEl = messageContainerEl.querySelector('.message-top');
  const messageBottomEl = messageContainerEl.querySelector('.message-bottom');
  messageTopEl.textContent = topMessage;
  messageBottomEl.textContent = bottomMessage;
  hideGameboard(3);
  messageContainerEl.style.display = 'flex';
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

export function showShips(showShipsBool, showPlayerShipsBool) {
  shipsVisible = showShipsBool;
}

const player1HealthBarEl = document.querySelector('.health-display.player-1');
const player2HealthBarEl = document.querySelector('.health-display.player-2');

export function adjustHealthBar(playerNum, healthValue) {
  let playerToAdjust = null;
  if (playerNum === '1') playerToAdjust = player1HealthBarEl;
  if (playerNum === '2') playerToAdjust = player2HealthBarEl;

  const healthPointNodeList = playerToAdjust.querySelectorAll('.health-point');
  const healthPointEls = Array.from(healthPointNodeList);
  const positiveHealth = healthPointEls.splice(0, healthValue);

  positiveHealth.forEach((healthPointEl) => {
    healthPointEl.classList.remove('empty')
    healthPointEl.classList.add('full')
  })

  healthPointEls.forEach((healthPointEl) => {
    healthPointEl.classList.remove('full')
    healthPointEl.classList.add('empty')
  })
}


const playAgainButtonEl = document.querySelector('button.play-again');

playAgainButtonEl.addEventListener('click', (e) => {
  window.location.reload();
})

export function displayPlayAgain() {
  playAgainButtonEl.style.display = 'block';
}

export function damageFeedback(playerNum) {
  playerBoards[playerNum].classList.add('damaged');
  setTimeout(() => {
    playerBoards[playerNum].classList.remove('damaged');
  }, 500);
}