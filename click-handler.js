import { startRound } from "./logic.js";
const playButton = document.querySelector('button.game');
const primaryCells = document.querySelectorAll('.cell.primary');
const opponentCells = document.querySelectorAll('.cell.opponent');

playButton.addEventListener('click', (e) => {
  startRound();
});

export function onPrimaryCellClick(callback) {
  primaryCells.forEach((cell) => cell.onclick = clickHandler);
  function clickHandler(cell) {
    callback(cell);
  }
}

export function onOpponentCellClick(callback) {
  opponentCells.forEach((cell) => cell.onclick = clickHandler);
  function clickHandler(cell) {
    callback(cell);
  }
}