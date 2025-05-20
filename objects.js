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
  #hasShip = false;
  #hasMissle = false;
  placeShip() { this.#hasShip = true };
  placeMissle() { this.#hasMissle = true };
  has() { return { ship: this.#hasShip, missle: this.#hasMissle } }
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

  place(x, y, length, isHorizontal = true) {
    const ship = new Ship(length);
    if (isHorizontal && x + length > 10 || !isHorizontal && y + length > 10) return false;
    if (isHorizontal) {
      for (let i = 0; i < length; i++) {
        this.getCell((x + i), y).placeShip();
      }
    } else {
      for (let i = 0; i < length; i++) {
        this.getCell(x, (y + i)).placeShip();
      }
    }
  }

  receiveAttack() {

  }
  shipsSunk() {

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