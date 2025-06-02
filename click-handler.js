import { startRound } from "./logic.js";

const playButton = document.querySelector('button.ready');

playButton.addEventListener('click', (e) => {
  playButton.style.visibility = 'hidden';
  startRound();
});

export function clickHandler(cell, name) {
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  console.log(name, x, y, cell);
  startRound();
}