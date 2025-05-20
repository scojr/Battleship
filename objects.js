export class Ship {
  constructor(length) {
    this.length = length;
    this.health = length;
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
  ships = [];
  missedAttacks = [];
  place(x, y, length, isHorizontal = true) {
    const ship = new Ship(length);
    this.ships.push(ship);
    if (isHorizontal && x + length > 10 || !isHorizontal && y + length > 10) return false;
    if (isHorizontal) {
      for (let i = 0; i < length; i++) {
        this.getCell((x + i), y).placeShip(ship);
      }
    } else {
      for (let i = 0; i < length; i++) {
        this.getCell(x, (y + i)).placeShip(ship);
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

  getShips() { return this.ships }

  areShipsSunk() {
    let foundSunk = false;
    this.ships.forEach(ship => {
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
  constructor() {

  }
}