import { Player } from "./objects.js";
import { devButtonOnClick, highlightCell, cellsOnClick, updateGameboards, showIntermission, hideGameboard, newHeaderMessage, continueButtonControls } from "./dom-controller.js";

const players = { 1: null, 2: null }
let activePlayer = '1';
let inactivePlayer = '2';

function togglePlayerTurn() {
  if (activePlayer = '1') {
    activePlayer = '2'
    inactivePlayer = '1'
  } else {
    activePlayer = '1'
    inactivePlayer = '2'
  }
}

startGame();
hideGameboard(3);

function startGame(playerClicked) {
  players['1'] = new Player();
  players['2'] = new Player(true);
  updateGameboards(players);
  if (playerClicked) promptPlayersForShips();
}

function promptPlayersForShips() {
  promptForShips(players['1']);
  promptForShips(players['2']);
  players['1'].autoPlaceShips(0);
  players['2'].autoPlaceShips(1);
  updateGameboards(players);
  continueButtonControls.enable();
  continueButtonControls.show();
  continueButtonControls.onClick(() => {
    continueButtonControls.disable();
    newRound();
  });
}

function promptForShips(player) {
  newHeaderMessage(`Player ${activePlayer}, place your ships.`)
  hideGameboard(parseInt(inactivePlayer));
  continueButtonControls.show();
  continueButtonControls.disable();

}

function newRound() {
  let clickedCell;
  newHeaderMessage(`Player ${activePlayer}, attack your opponent!`)
  hideGameboard(parseInt(activePlayer));
  cellsOnClick((e) => {
    clickedCell = e.target;
    continueButtonControls.onClick(() => {
      players[inactivePlayer].gameboard.recieveAttack(clickedCell.dataset.x, clickedCell.dataset.y);
      updateGameboards(players);
      continueButtonControls.hide();
      continueButtonControls.disable();
    });
    highlightCell(e.target);
    continueButtonControls.enable();

  })
}

function printGrids() {
  console.log('\n\nPlayer 1')
  players['1'].gameboard.printGrid();
  console.log('\n\nPlayer 2')
  players['2'].gameboard.printGrid();
}

export { startGame, newRound }