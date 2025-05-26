import { Game } from "./objects.js";
import { refreshPlayerGrid } from "./display-controller.js";

let activePlayer = true;
const stages = [null, 'placement', 'round', 'end']
let gameStage = stages[0];

export function startGame() {
  const name = "Player";
  const activeGame = new Game(name);
  autoPlaceShips(activeGame.player1);
  gameStage = stages[1];
}

function startRound() {
}

function endGame() {

}

function autoPlaceShips(player) {
  player.place(1, 1, 'carrier');
  player.place(1, 3, 'battleship');
  player.place(1, 6, 'cruiser', true);
  player.place(4, 5, 'submarine', true);
  player.place(7, 7, 'destroyer');
  console.log(player.gameboard.getGrid());
  player.gameboard.prettyPrintGrid();
  refreshPlayerGrid(player.gameboard);
}