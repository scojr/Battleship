import { Player } from "./objects.js";

let player1;
let player2;

function startGame() {
  player1 = new Player();
  player2 = new Player(true);
}

startGame();

player1.autoPlaceShips();
player1.gameboard.printGrid();