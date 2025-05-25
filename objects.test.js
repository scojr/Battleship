import { Ship, Gameboard } from './objects';


describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(5);
  });

  test('new Ship isSunk() returns false', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('after 5 hits isSunk() returns true', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
})

describe('Gameboard', () => {
  jest.mock('./objects');
  let gameboard;
  let newShip;
  beforeEach(() => {
    gameboard = new Gameboard();
    newShip = new Ship(5)
  });

  test('new Gameboard grid has empty cells', () => {
    expect(gameboard.getCell(0, 0).has()).toEqual({ ship: false, missle: false });
    expect(gameboard.getCell(4, 4).has()).toEqual({ ship: false, missle: false });
    expect(gameboard.getCell(9, 9).has()).toEqual({ ship: false, missle: false });
  });

  test('cell.has() returns ship object if present', () => {
    gameboard.place(3, 3, newShip);
    expect(gameboard.getCell(3, 3).has().ship).toEqual({ health: 5, length: 5 });
    expect(gameboard.getCell(7, 3).has().ship).toEqual({ health: 5, length: 5 });
    expect(gameboard.getCell(8, 3).has()).toEqual({ ship: false, missle: false });
  });

  test('isShip returns true if ship placed vertical', () => {
    gameboard.place(3, 3, newShip, false);
    expect(gameboard.getCell(3, 3).has().ship).toEqual({ health: 5, length: 5 });
    expect(gameboard.getCell(3, 7).has().ship).toEqual({ health: 5, length: 5 });
    expect(gameboard.getCell(3, 8).has()).toEqual({ ship: false, missle: false });
  });

  test('only place ships if they fit', () => {
    expect(gameboard.place(7, 2, newShip)).toBe(false);
    expect(gameboard.getCell(7, 2).has()).toEqual({ ship: false, missle: false });
    expect(gameboard.place(2, 7, newShip, false)).toBe(false);
    expect(gameboard.getCell(2, 7).has()).toEqual({ ship: false, missle: false });
  });

  test('recieveAttack() attack ship if present and record misses', () => {
    gameboard.place(3, 3, newShip);
    gameboard.receiveAttack(3, 3);
    expect(gameboard.getCell(3, 3).has().ship).toEqual({ health: 4, length: 5 });
    gameboard.receiveAttack(3, 3);
    expect(gameboard.getCell(7, 3).has().ship).toEqual({ health: 3, length: 5 });
    expect(gameboard.receiveAttack(2, 3)).toBe(false);
    expect(gameboard.getMissedAttacks()).toEqual([[2, 3]]);
  });

  test('areShipsSunk() returns true if all ships have been sunk', () => {
    gameboard.place(3, 3, newShip);
    gameboard.receiveAttack(3, 3);
    gameboard.receiveAttack(3, 3);
    gameboard.receiveAttack(3, 3);
    expect(gameboard.areShipsSunk()).toBe(false);
    gameboard.receiveAttack(3, 3);
    gameboard.receiveAttack(3, 3);
    expect(gameboard.getShips()[0]).toEqual({ health: 0, length: 5 });
    expect(gameboard.areShipsSunk()).toBe(true);
  });
})