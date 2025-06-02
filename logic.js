import { Game } from "./objects.js";
import { toggleGridOverlay, refreshGrids, displayInterface, buttonStates } from "./display-controller.js";

const game = startGame();
autoPlaceShips(game.player1);
autoPlaceShips2(game.player2);
refreshGrids(game);

function startGame() {
  const name = "Player";
  const activeGame = new Game(name);
  return activeGame;
}

export function startRound() {
  const activePlayer = game.toggleActivePlayer();
  displayInterface.updateHeader(`${activePlayer.name}, it's your turn!`);
  displayInterface.updateMessage('Select a cell, then click the \'Fire!\' button to attack!');
  if (activePlayer === game.getPlayer1()) {
    buttonStates.fire();
    console.log('confirm')
    toggleGridOverlay();
  } else {
    buttonStates.inactive();
    toggleGridOverlay(true);
  }
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