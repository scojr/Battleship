import { Player } from "./objects.js";
import { highlightCell, cellsOnClick, updateGameboards, showMessage, hideGameboard, newHeaderMessage, continueButtonControls, showShips } from "./dom-controller.js";
import { initiateShipPlacement, endShipPlacement } from "./drag-drop.js";

const players = { 1: null, 2: null }
let activePlayer = '1';
let inactivePlayer = '2';

function togglePlayerTurn() {
  if (activePlayer === '1') {
    activePlayer = '2'
    inactivePlayer = '1'
    return
  }
  if (activePlayer === '2') {
    activePlayer = '1'
    inactivePlayer = '2'
    return
  }
}

startGame();
hideGameboard(3);

function startGame(playerClicked) {
  players['1'] = new Player();
  players['2'] = new Player(true);
  updateGameboards(players);
  if (playerClicked) promptForShipPlacement(activePlayer);
  continueButtonControls.onClick(() => {
    togglePlayerTurn();
    promptForShipPlacement(activePlayer, true);
  })
}

function promptForShipPlacement(activePlayer, second = false) {
  showMessage(`Player ${activePlayer}`, 'Place your ships', 'OK')
  newHeaderMessage(`Player ${activePlayer}, place your ships.`)
  hideGameboard(parseInt(inactivePlayer));
  continueButtonControls.show();
  continueButtonControls.disable();
  initiateShipPlacement(players, activePlayer, () => {
    continueButtonControls.enable();
  });
  if (second) {
    continueButtonControls.onClick(() => {
      showShips(false);
      endShipPlacement();
      togglePlayerTurn();
      newRound();
    })
  }
}

function newRound() {
  updateGameboards(players);
  let clickedCell;
  continueButtonControls.message('Attack')
  continueButtonControls.disable();
  newHeaderMessage(`Player ${activePlayer}, attack your opponent!`)
  hideGameboard(parseInt(activePlayer));
  cellsOnClick((e) => {
    clickedCell = e.target;
    continueButtonControls.onClick(() => {
      const attack = players[inactivePlayer].gameboard.recieveAttack
        (clickedCell.dataset.x, clickedCell.dataset.y);
      let message = `You missed! Player ${inactivePlayer} is up next.`;
      if (attack) message = `You hit! Player ${inactivePlayer} is up next.`;;
      updateGameboards(players);
      newHeaderMessage(message);
      continueButtonControls.enable();
      continueButtonControls.message('Continue')
      togglePlayerTurn();
      continueButtonControls.onClick(() => {
        newRound()
      });
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