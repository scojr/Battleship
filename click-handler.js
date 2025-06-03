import { newRound } from "./logic.js";
const playButton = document.querySelector('button.game');
const primaryCells = document.querySelectorAll('.cell.primary');
const opponentCells = document.querySelectorAll('.cell.opponent');

playButton.addEventListener('click', (e) => {
  newRound();
});

export function onPrimaryCellClick(callback) {
  primaryCells.forEach((cell) => cell.onclick = clickHandler);
  function clickHandler(cell) {
    callback(cell.srcElement);
  }
}

export function onOpponentCellClick(callback) {
  opponentCells.forEach((cell) => cell.onclick = clickHandler);
  function clickHandler(cell) {
    callback(cell.srcElement);
  }
}