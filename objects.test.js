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

  test('new Gameboard grid contains cells with null value', () => {
    expect(gameboard.getCell(0, 0)).toEqual({ value: null });
    expect(gameboard.getCell(4, 4)).toEqual({ value: null });
    expect(gameboard.getCell(9, 9)).toEqual({ value: null });
  });
})