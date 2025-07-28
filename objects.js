class Ship {
  constructor(length) {
    this.length = length;
  }
  hits = 0;
  hit() {
    this.hits += 1;
  }
  isSunk() {
    if (this.hits >= this.length) return true;
    else return false;
  }
}

class Gameboard {
  constructor() {
    this.grid = createGrid();
  }
  ships = [];
  missedAttacks = [];
  placeShip(x, y, length, axis = x) {
    if (axis + length > 10) return;
    let ship = new Ship(length);
    this.grid[y][x] = ship;
    this.ships.push(ship);
  }
  recieveAttack(x, y) {
    const ship = this.grid[x][y];
    if (ship) ship.hit();
    else {
      this.missedAttacks.push({ x, y });
      return false
    };
  }
  shipsSunk() {
    for (let ship of this.ships) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }
  getCell(x, y) {
    return this.grid[y][x];
  }
  printGrid() {
    for (let row of this.grid) {
      console.log(row);
    }
  }
}

function createGrid() {
  const grid = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      let cell = null;
      row.push(cell)
    }
    grid.push(row);
  }
  return grid;
}

export class Player {
  constructor(isCPU = false) {
    this.isCPU = isCPU;
  }
  gameboard = new Gameboard;
}