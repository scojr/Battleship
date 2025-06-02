import { startRound } from "./logic.js";

const playButton = document.querySelector('button.game');

playButton.addEventListener('click', (e) => {
  startRound();
});

export function clickHandler(cell, name) {
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  console.log(name, x, y, cell);
  startRound();
}