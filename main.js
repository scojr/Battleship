import { Player } from "./objects.js";

let player1;
let player2;

function startGame() {
  player1 = new Player();
  player2 = new Player(true);
}

startGame();

player1.gameboard.placeShip(3, 1, 5);
player1.gameboard.printGrid();
console.log(player1.gameboard.getCell(3, 1));