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
  placeShip(x, y, length, rotate = false) {
    if (x < 0 || y < 0) return;
    let axis;
    rotate ? axis = y : axis = x;
    if (axis + length > 10) return;
    const shipCoords = [];
    for (let i = 0; i < length; i++) {
      let cell;
      rotate ? cell = { x, y: y + i } : cell = { x: x + i, y };
      if (this.grid[cell.y][cell.x]) return false;
      else shipCoords.push(cell);
    }
    let ship = new Ship(length);
    shipCoords.forEach((coord) => {
      this.grid[coord.y][coord.x] = ship;
    })
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

  autoPlaceShips(num) {
    const shipsLayouts = [
      [[1, 8, 5], [7, 1, 4, true], [7, 6, 3, true], [2, 3, 3], [1, 5, 2]],
      [[4, 1, 5], [3, 5, 4, true], [1, 3, 3, true], [5, 6, 3], [5, 3, 2, true]]
    ]
    let layout = shipsLayouts[num];
    layout.forEach((coord) => this.gameboard.placeShip(...coord))
  }
}