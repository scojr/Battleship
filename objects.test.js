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
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('new Gameboard grid has empty cells', () => {
    expect(gameboard.getCell(0, 0).has()).toEqual({ ship: false, missle: false });
    expect(gameboard.getCell(4, 4).has()).toEqual({ ship: false, missle: false });
    expect(gameboard.getCell(9, 9).has()).toEqual({ ship: false, missle: false });
  });

  test('isShip returns true when ship placed', () => {
    gameboard.place(3, 3, 5);
    expect(gameboard.getCell(3, 3).has()).toEqual({ ship: true, missle: false });
    expect(gameboard.getCell(7, 3).has()).toEqual({ ship: true, missle: false });
    expect(gameboard.getCell(8, 3).has()).toEqual({ ship: false, missle: false });
  });

  test('isShip returns true when ship placed vertically', () => {
    gameboard.place(3, 3, 5, false);
    expect(gameboard.getCell(3, 3).has()).toEqual({ ship: true, missle: false });
    expect(gameboard.getCell(3, 7).has()).toEqual({ ship: true, missle: false });
    expect(gameboard.getCell(3, 8).has()).toEqual({ ship: false, missle: false });
  });

  test('only place ships if they fit', () => {
    expect(gameboard.place(7, 2, 5)).toBe(false);
    expect(gameboard.getCell(7, 2).has()).toEqual({ ship: false, missle: false });
    expect(gameboard.place(2, 7, 5, false)).toBe(false);
    expect(gameboard.getCell(2, 7).has()).toEqual({ ship: false, missle: false });
  });
})