import { Player } from "./objects.js";

let player1;
let player2;

function startGame() {
  player1 = new Player();
  player2 = new Player(true);
}

startGame();

player1.autoPlaceShips(0);
player2.autoPlaceShips(1);
printGrids();

function printGrids() {
  console.log('\n\nPlayer 1')
  player1.gameboard.printGrid();
  console.log('\n\nPlayer 2')
  player2.gameboard.printGrid();
}