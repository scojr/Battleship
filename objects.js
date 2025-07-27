export class Ship {
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

  }
}

class Player {
  constructor() {

  }
}