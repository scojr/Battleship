import { Player } from "./objects.js";
import { highlightCell, cellsOnClick, updateGameboards, showMessage, hideGameboard, newHeaderMessage, continueButtonControls, showShips, adjustHealthBar, displayPlayAgain } from "./dom-controller.js";
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

function startGame(playerClicked, clickedCPU) {
  players['1'] = new Player();
  if (clickedCPU) {
    players['2'] = new Player(true);
  } else {
    players['2'] = new Player();
  }
  updateGameboards(players);
  if (playerClicked) promptForShipPlacement(activePlayer);
  continueButtonControls.onClick(() => {
    togglePlayerTurn();
    promptForShipPlacement(activePlayer, true);
  })
}

function promptForShipPlacement(activePlayer, second = false) {
  continueButtonControls.hide();
  if (players[activePlayer].isCPU) {
    placeShipsCPU()
    endShipPlacement();
    togglePlayerTurn();
    newRound();
    return;
  }
  showMessage(`Player ${activePlayer}`, 'Drag your ships onto the board. Click to rotate.', activePlayer)
  newHeaderMessage(`Player ${activePlayer} - place your ships`)
  hideGameboard(parseInt(inactivePlayer));
  continueButtonControls.disable();
  continueButtonControls.move(activePlayer);
  initiateShipPlacement(players, activePlayer, () => {
    continueButtonControls.show();
    continueButtonControls.enable();
    showMessage(false);
  });
  if (second) {
    continueButtonControls.onClick(() => {
      // showShips(false);
      endShipPlacement();
      togglePlayerTurn();
      newRound();
    })
  }
}

function newRound() {
  continueButtonControls.show();
  showMessage(false);
  continueButtonControls.move(inactivePlayer);
  updateGameboards(players);
  continueButtonControls.message('Attack')
  continueButtonControls.disable();
  newHeaderMessage(`Player ${activePlayer} - attack your opponent`)
  hideGameboard(parseInt(activePlayer));
  cellsOnClick((e) => { targetCell(e) })
}

function placeShipsCPU(playerNum) {
  const cpuPlayer = players[playerNum];
  console.log('explain')
  let counter = 0;
  while (counter > 5) {
    const placeAttempt = cpuPlayer.gameboard.placeShip();
    if (placeAttempt) counter++;
  }
}

function randomAttackCPU() {

}

function getRandomCoords() {
  const random11 = function () {
    return Math.floor(Math.random() * 11);
  }
  let x = random11();
  let y = random11();
  return { x, y };
}

function targetCell(e) {
  let clickedCell;
  clickedCell = e.target;
  continueButtonControls.onClick(() => { confirmAttack(clickedCell) });
  highlightCell(e.target);
  continueButtonControls.enable();
}

function confirmAttack(clickedCell) {
  const attack = players[inactivePlayer].gameboard.recieveAttack
    (clickedCell.dataset.x, clickedCell.dataset.y);
  let message = `Player ${activePlayer} missed - Player ${inactivePlayer} is up next`;
  if (attack) message = `Player ${activePlayer} hit - attack your opponent`;
  if (testHealth(inactivePlayer)) return;
  updateGameboards(players);
  newHeaderMessage(message);
  continueButtonControls.enable();
  continueButtonControls.message('Continue')
  if (!attack) togglePlayerTurn();
  continueButtonControls.onClick(() => {
    newRound()
  });
}

function printGrids() {
  console.log('\n\nPlayer 1')
  players['1'].gameboard.printGrid();
  console.log('\n\nPlayer 2')
  players['2'].gameboard.printGrid();
}

function testHealth(playerNum) {
  const playerObject = players[playerNum]
  const playerHealth = playerObject.gameboard.getTotalHealth();
  adjustHealthBar(playerNum, playerHealth);
  if (playerHealth === 0) {
    endGame(activePlayer)
    return true;
  };
}

function endGame(playerWinNum) {
  showShips(true);
  hideGameboard(false);
  continueButtonControls.hide();
  updateGameboards(players);
  newHeaderMessage(`Player ${playerWinNum} wins`);
  displayPlayAgain();
}

export { startGame, newRound }