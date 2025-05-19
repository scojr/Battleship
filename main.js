export class Ship {
  constructor(length) {
    this.length = length;
  }
  health = this.length;
  hit() {
    this.health -= 1;
  }
  isSunk() {
    if (this.health > 1) return true;
    else return false;
  }
}