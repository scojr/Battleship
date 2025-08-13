import { Ship, Gameboard } from "./objects";

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(5);
  })

  test('isSunk() returns false on new Ship', () => {
    expect(ship.isSunk()).toBe(false);
  })

  test('isSunk() still returns false after 4 hits', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  })

  test('isSunk() returns true after 5 hits', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  })
})

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard;
  })

  test('placeShip method assigns ship to grid coordinates, adds to ship array', () => {
    gameboard.placeShip(5, 2, 5);
    expect(gameboard.ships[0]).toEqual({ "hits": 0, "length": 5, "rotation": false, "start": [5, 2,] });
  })

  test('getCell method returns the contents of specified cell', () => {
    expect(gameboard.getCell(5, 2)).toBe(null);
    gameboard.placeShip(5, 2, 5);
    expect(gameboard.getCell(5, 2)).not.toBe(null);
  })

  test('recieveAttack returns false if no ship present, adds coordinates to missedAttacks array', () => {
    expect(gameboard.recieveAttack(1, 1)).toBe(false);
    expect(gameboard.recievedAttacks.length).toBe(1);
  })

  test('recieveAttack method damages ship if present', () => {
    gameboard.placeShip(1, 1, 5);
    gameboard.recieveAttack(1, 1);
    expect(gameboard.getCell(1, 1)).toEqual({ "hits": 1, "length": 5, "rotation": false, "start": [1, 1,] });
  })

  test('shipsSunk returns true if all ships are sunk', () => {
    gameboard.placeShip(1, 1, 1);
    gameboard.placeShip(8, 8, 1);
    expect(gameboard.shipsSunk()).toBe(false);
    gameboard.recieveAttack(1, 1);
    gameboard.recieveAttack(8, 8);
    expect(gameboard.shipsSunk()).toBe(true);
  })

  test('removeShip removes ship from gameboard', () => {
    gameboard.placeShip(1, 1, 5);
    expect(gameboard.getCell(1, 1)).toEqual({ "hits": 0, "length": 5, "rotation": false, "start": [1, 1,] });
    gameboard.removeShip(2, 1);
    expect(gameboard.getCell(1, 1)).toEqual(null);
  })

  test('getTotalHealth returns the value of the length of every ship with hits subtracted', () => {
    gameboard.placeShip(1, 1, 5);
    gameboard.placeShip(1, 2, 5);
    expect(gameboard.getTotalHealth()).toEqual(10);
    gameboard.recieveAttack(1, 1);
    gameboard.recieveAttack(1, 1);
    gameboard.recieveAttack(1, 2);
    expect(gameboard.getTotalHealth()).toEqual(7);
  })
})