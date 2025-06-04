export class Ship {
  constructor(length, type) {
    this.length = length;
    this.health = length;
    this.type = type;
  }
  hit() {
    this.health -= 1;
  }
  isSunk() {
    if (this.health < 1) return true;
    else return false;
  }
}

class Cell {
  #ship = false;
  #missile = false;
  placeShip(ship) { this.#ship = ship };
  placeMissile() {
    this.#missile = true
    if (this.#ship) this.#ship.hit();
  };
  has() { return { ship: this.#ship, missile: this.#missile } }
}

export class Gameboard {
  constructor() {
    this.grid = populateGrid();

    function populateGrid() {
      const grid = []
      for (let i = 0; i < 10; i++) {
        const row = [];
        for (let i = 0; i < 10; i++) {
          row.push(new Cell());
        }
        grid.push(row);
      }
      return grid;
    }
  }
  shipsOnBoard = [];
  missedAttacks = [];
  place(x, y, Ship, isHorizontal = false) {
    const shipLength = Ship.length;
    this.shipsOnBoard.push(Ship);
    if (isHorizontal && y + shipLength < 10 || !isHorizontal && x + shipLength < 10) {
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          this.getCell((y + i), x).placeShip(Ship);
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          this.getCell(y, (x + i)).placeShip(Ship);
        }
      }
    } else return false;
  }

  getMissedAttacks() { return this.missedAttacks };

  receiveAttack(x, y) {
    const attackedCell = this.getCell(x, y);
    attackedCell.placeMissile();
    if (attackedCell.has().ship) {
      return true;
    } else {
      this.missedAttacks.push([x, y]);
      return false;
    }
  }

  getShips() { return this.shipsOnBoard }

  areShipsSunk() {
    let foundSunk = false;
    this.shipsOnBoard.forEach(ship => {
      if (ship.isSunk()) foundSunk = true;
    })
    return foundSunk;
  }

  getHealthOfShips() {
    return this.shipsOnBoard.reduce((acc, ship) => { return acc + ship.health }, 0);
  }

  getCell(x, y) {
    return this.grid[y][x];
  }
  getGrid() {
    return this.grid;
  }
  prettyPrintGrid() {
    this.grid.forEach((row, index) => {
      const rowText = [];
      row.forEach(cell => {
        if (cell.has().ship) rowText.push('[o]');
        else rowText.push('[ ]')
      })
      console.log(index, rowText.join(""));
    })
  }
}

export class Player {
  constructor(name, isComputer) {
    this.name = name;
    this.isComputer = isComputer;
    this.gameboard = new Gameboard;
    this.ships = [new Ship(5, 'carrier'), new Ship(4, 'battleship'), new Ship(3, 'cruiser'), new Ship(3, 'submarine'), new Ship(2, 'destroyer')]
  }
  getPlayerHealth() {
    return this.gameboard.getHealthOfShips();
  }
  place(x, y, Ship, isHorizontal = false) {
    const shipToPlace = this.ships.find(e => e.type === Ship) || null;
    if (shipToPlace !== null) {
      this.gameboard.place(x, y, shipToPlace, isHorizontal);
    }
  }
  getRandomCoords() {
    const random10 = function () {
      return Math.floor(Math.random() * 10);
    }
    let x = random10();
    let y = random10();
    return { x, y };
  }
}

export class Game {
  constructor(player1Name, player2Name, isMultiplayer = false) {
    this.player1 = new Player(player1Name);
    if (isMultiplayer) this.player2 = new Player(player2Name);
    else this.player2 = new Player('Opponent', true);
    this.playerBool = getRandomBool();
  }
  getPlayer1() {
    return this.player1;
  }
  getPlayer2() {
    return this.player2;
  }
  toggleActivePlayer() {
    this.playerBool = !this.playerBool;
    return this.playerBool ? [this.player1, this.player2] : [this.player2, this.player1];
  }
}

function getRandomBool() {
  const num = Math.floor(Math.random() * 2);
  return num ? true : false;
}