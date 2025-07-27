import { Ship } from "./objects";

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