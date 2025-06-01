import { Game } from "./objects.js";
import { refreshGrids } from "./display-controller.js";

export function startGame() {
  const name = "Player";
  const activeGame = new Game(name);
  autoPlaceShips(activeGame.player1);
  autoPlaceShips2(activeGame.player2);
  refreshGrids(activeGame);
}

function autoPlaceShips(player) {
  player.place(1, 1, 'carrier');
  player.place(1, 3, 'battleship');
  player.place(1, 6, 'cruiser', true);
  player.place(4, 5, 'submarine', true);
  player.place(7, 7, 'destroyer');
}

function autoPlaceShips2(player) {
  player.place(1, 8, 'carrier');
  player.place(8, 3, 'battleship', true);
  player.place(1, 3, 'cruiser', true);
  player.place(4, 2, 'submarine', true);
  player.place(4, 6, 'destroyer');
}