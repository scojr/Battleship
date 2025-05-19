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
  constructor(value = null) {
    this.value = value;
  }
}

export class Gameboard {
  constructor() {
    this.grid = populateGrid();

    function populateGrid() {
      const grid = []
      for (let i = 0; i < 10; i++) {
        const row = [];
        for (let i = 0; i < 10; i++) {
          row.push(new Cell(null));
        }
        grid.push(row);
      }
      return grid;
    }
  }
  place() {

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