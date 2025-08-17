export class Ship {
  constructor(length, start, rotation = false) {
    this.length = length;
    this.start = start;
    this.rotation = rotation;
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

export class Gameboard {
  constructor() {
    this.grid = createGrid();
  }
  ships = [];
  recievedAttacks = [];
  placeShip(x, y, length, rotate = false) {
    if (x < 0 || y < 0) return false;
    let axis;
    rotate ? axis = y : axis = x;
    if (axis + length > 11) return false;
    const shipCoords = [];
    for (let i = 0; i < length; i++) {
      let cell;
      rotate ? cell = { x, y: y + i } : cell = { x: x + i, y };
      if (this.grid[cell.y][cell.x]) return false;
      else shipCoords.push(cell);
    }
    let ship = new Ship(length, [x, y], rotate);
    shipCoords.forEach((coord) => {
      this.grid[coord.y][coord.x] = ship;
    })
    this.ships.push(ship);
    return true;
  }
  removeShip(x, y) {
    const shipObject = this.getCell(x, y);
    if (!shipObject) return false;
    const shipLength = shipObject.length;
    const shipRotation = shipObject.rotation;
    const shipX = shipObject.start[0];
    const shipY = shipObject.start[1];
    for (let i = 0; i < shipLength; i++) {
      let cell;
      shipRotation ? cell = { shipX, shipY: shipY + i } : cell = { shipX: shipX + i, shipY };
      this.grid[cell.shipY][cell.shipX] = null;
    }
    this.ships.splice(this.ships.indexOf(shipObject), 1);
  }
  recieveAttack(x, y) {
    const ship = this.grid[y][x];
    let isHit;
    if (ship) {
      ship.hit();
      isHit = true;
      this.recievedAttacks.push({ x, y, isHit });
      return isHit;
    } else {
      isHit = false;
      this.recievedAttacks.push({ x, y, isHit });
      return isHit
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
  getTotalHealth() {
    let total = 0;
    this.ships.forEach((ship) => {
      total += (ship.length - ship.hits);
    })
    return total;
  }
}

function createGrid() {
  const grid = [];
  for (let i = 0; i < 11; i++) {
    const row = [];
    for (let j = 0; j < 11; j++) {
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