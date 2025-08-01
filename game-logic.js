import { Player } from "./objects.js";
import { devButtonOnClick, updateGameboards, showIntermission, hideGameboard, newHeaderMessage, continueButtonControls } from "./dom-controller.js";

const players = { 1: null, 2: null }

startGame();
hideGameboard(3);

function startGame(playerClicked) {
  players['1'] = new Player();
  players['2'] = new Player(true);
  console.log()
  updateGameboards(players);
  if (playerClicked) promptForShips()
}

function promptForShips() {
  newHeaderMessage('Player 1, place your ships.')
  hideGameboard(2);
  continueButtonControls.show();
  continueButtonControls.disable();
  devButtonOnClick(() => {
    continueButtonControls.enable();
    continueButtonControls.onClick(() => console.log('test'));
    players['1'].autoPlaceShips(0);
    updateGameboards(players);
    console.log(players);
    console.log(players['1'].gameboard)
  });
}

function newRound() {

}

function printGrids() {
  console.log('\n\nPlayer 1')
  players['1'].gameboard.printGrid();
  console.log('\n\nPlayer 2')
  players['2'].gameboard.printGrid();
}

export { startGame, newRound }