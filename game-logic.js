import { Player } from "./objects.js";
import { highlightCell, getCellEl, cellsOnClick, updateGameboards, showMessage, hideGameboard, newHeaderMessage, continueButtonControls, showShips, adjustHealthBar, displayPlayAgain, damageFeedback } from "./dom-controller.js";
import { initiateShipPlacement, endShipPlacement } from "./drag-drop.js";

const players = { 1: null, 2: null }
let activePlayer = '1';
let inactivePlayer = '2';
let isCPU = false;

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
    isCPU = true;
    showShips(true);
  } else {
    players['2'] = new Player();
    showShips(true);
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
    placeShipsCPU(activePlayer)
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
      if (isCPU) {
        showShips(true);
      } else {
        showShips(false);
      }
      endShipPlacement();
      togglePlayerTurn();
      newRound();
    })
  }
}

function newRound() {
  showMessage(false);
  updateGameboards(players);
  if (isCPU) hideGameboard(false);
  else hideGameboard(parseInt(activePlayer));
  if (players[activePlayer].isCPU) {
    randomAttackCPU(inactivePlayer)
    return;
  }
  continueButtonControls.show();
  continueButtonControls.move(inactivePlayer);
  continueButtonControls.message('Attack')
  continueButtonControls.disable();
  newHeaderMessage(`Player ${activePlayer} - attack your opponent`)
  cellsOnClick((e) => { targetCell(e) })
}

function placeShipsCPU(playerNum) {
  const cpuPlayer = players[playerNum];
  const shipLengths = [
    5, 4, 3, 3, 2
  ];
  let counter = 0;
  while (counter < 5) {
    const randomCoords = getRandomCoords();
    const placeAttempt = cpuPlayer.gameboard.placeShip(randomCoords.x, randomCoords.y, shipLengths[counter], randomCoords.bool);
    if (placeAttempt) counter++;
  }
}

function randomAttackCPU(playerNum) {
  continueButtonControls.hide();
  let randomCoords = getRandomCoords();
  const recievedAttacks = players['1'].gameboard.recievedAttacks;
  let hasRandomCoords = recievedAttacks.some(cell => cell.x === randomCoords.x && cell.y === randomCoords.y);
  if (hasRandomCoords) {
    randomAttackCPU(playerNum)
  } else {
    const randomCellEl = getCellEl(playerNum, randomCoords.x, randomCoords.y);
    highlightCell(randomCellEl, true);
    setTimeout(() => confirmAttack(randomCoords.x, randomCoords.y), 1000);
  }
}

function getRandomCoords() {
  const randomNum = function (num) {
    return Math.floor(Math.random() * num);
  }
  let x = randomNum(11);
  let y = randomNum(11);
  let bool = randomNum(2);
  return { x, y, bool };
}

function targetCell(e) {
  let clickedCell;
  clickedCell = e.target;
  continueButtonControls.onClick(() => { confirmAttack(clickedCell.dataset.x, clickedCell.dataset.y) });
  highlightCell(e.target);
  continueButtonControls.enable();
}

function confirmAttack(cellX, cellY) {
  const attack = players[inactivePlayer].gameboard.recieveAttack
    (cellX, cellY);
  let message = `Player ${activePlayer} missed - Player ${inactivePlayer} is up next`;
  if (attack) {
    message = `Player ${activePlayer} hit - attack your opponent`;
    damageFeedback(inactivePlayer);
  }
  if (testHealth(inactivePlayer)) return;
  updateGameboards(players);
  newHeaderMessage(message);
  if (!attack) togglePlayerTurn();
  if (isCPU) {
    if (players[activePlayer].isCPU) setTimeout(() => newRound(), 200);
    else newRound();
  } else {
    continueButtonControls.enable();
    continueButtonControls.message('Continue')
    continueButtonControls.onClick(() => {
      newRound()
    });
  }
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