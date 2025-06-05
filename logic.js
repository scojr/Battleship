import { Game } from "./objects.js";
import { toggleGridOverlay, refreshGrids, displayInterface, buttonStates, updateCellState, updateGridState } from "./display-controller.js";
import { onPrimaryCellClick, onOpponentCellClick, onButtonClick } from "./click-handler.js";

const game = startGame();
autoPlaceShips(game.player1);
autoPlaceShips2(game.player2);
refreshGrids(game);

function startGame() {
  const name = "Player";
  const activeGame = new Game(name);
  onButtonClick(newRound)
  return activeGame;
}

export function newRound() {
  updateGridState(1).clicksOn();
  onButtonClick(newRound)
  const players = game.toggleActivePlayer();
  const activePlayer = players[0];
  const enemyPlayer = players[1];
  newRoundDisplay(players);
  buttonStates.inactive();
  if (activePlayer === game.getPlayer1()) {
    toggleGridOverlay();
    onOpponentCellClick((cell) => {
      updateCellState(cell).target();
      refreshGrids(game);
      buttonStates.fire();
      onButtonClick(confirmAttack)
      function confirmAttack() {
        updateCellState(cell).untarget();
        enemyPlayer.gameboard.receiveAttack(cell.dataset.x, cell.dataset.y);
        intermission();
      }
    });
  } else {
    toggleGridOverlay(true);
    if (activePlayer.isComputer) {
      let randomCoords;
      let cell;
      do {
        randomCoords = activePlayer.getRandomCoords();
        cell = enemyPlayer.gameboard.getCell(randomCoords.x, randomCoords.y)
      } while (cell.has().missile);
      enemyPlayer.gameboard.receiveAttack(randomCoords.x, randomCoords.y)
      intermission();
    }
  }
}

function intermission() {
  updateGridState(1).clicksOff();
  refreshGrids(game);
  buttonStates.continue();
  onButtonClick(newRound)
}

function newRoundDisplay(players) {
  displayInterface.updateHeader(`${players[0].name}, it's your turn!`);
  displayInterface.updateMessage('Select a cell, then click the \'Fire!\' button to attack!');
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