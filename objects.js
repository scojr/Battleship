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
  #missle = false;
  placeShip(ship) { this.#ship = ship };
  placeMissle() {
    this.#missle = true
    if (this.#ship) this.#ship.hit();
  };
  has() { return { ship: this.#ship, missle: this.#missle } }
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
  place(x, y, Ship, isHorizontal = true) {
    const shipLength = Ship.length;
    this.shipsOnBoard.push(Ship);
    if (isHorizontal && x + shipLength > 10 || !isHorizontal && y + shipLength > 10) return false;
    if (isHorizontal) {
      for (let i = 0; i < shipLength; i++) {
        this.getCell((x + i), y).placeShip(Ship);
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        this.getCell(x, (y + i)).placeShip(Ship);
      }
    }
  }

  getMissedAttacks() { return this.missedAttacks };

  receiveAttack(x, y) {
    const attackedCell = this.getCell(x, y);
    if (attackedCell.has().ship) {
      attackedCell.placeMissle();
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

  getCell(x, y) {
    return this.grid[x][y];
  }
  getGrid() {
    return this.grid;
  }
}

export class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard;
  }
}

class Game {
  constructor(againstPlayer = false) {
    this.againstPlayer = againstPlayer;
    this.gameboard = new Gameboard();
    this.ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(5)]
  }
}
