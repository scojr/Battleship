import { Ship } from './objects';
jest.mock('./objects');

beforeEach(() => {
  Ship.mockClear();
})