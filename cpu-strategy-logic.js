let stage = 0;
let players;
const attackQueue = [];
let attackIndex = 0;
let discoveredCell;

export function initializeCpu(playersArray) {
  players = playersArray;
}

const cpuStrategyStages = [
  cpuStageSearching, cpuStageDiscovery, cpuStageFollowUp, cpuStageFinish,
]

export function getCpuAttack() {
  let cpuAttack;
  cpuAttack = cpuStrategyStages[stage]();
  while (!cpuAttack.coords || !isValidTarget(cpuAttack.coords)) {
    cpuAttack = cpuStrategyStages[stage]();
  }
  return cpuAttack
}

function cpuStageSearching() {
  let randomCoords = getRandomCoords();

  function onMiss(cell) {
  }
  function onHit(cell) {
    const coordSides = getCoordSides(cell)
    attackQueue.push(...coordSides)
    stage = 1;
  }
  return { coords: randomCoords, onMiss, onHit };
}

function cpuStageDiscovery() {
  let coords;
  if (attackQueue.length) coords = attackQueue.shift();
  else strategyReset();
  function onMiss(cell) {
    attackIndex++;
  }
  function onHit(cell) {
    discoveredCell = cell;
    const path = getPathRecursion(discoveredCell, attackIndex);
    attackQueue.length = 0;
    attackQueue.push(...path);
    stage = 2;
  }
  return { coords, onMiss, onHit };
}

function cpuStageFollowUp() {
  let coords;
  if (attackQueue.length) coords = attackQueue.shift();
  else strategyReset();
  function onMiss(cell) {
    if (attackIndex < 2) {
      const path = getPathRecursion(discoveredCell, attackIndex + 2);
      attackQueue.length = 0;
      attackQueue.push(...path)
      stage = 3;
    } else {
      strategyReset();
    }
  }
  function onHit(cell) {
  }
  return { coords, onMiss, onHit };

}

function cpuStageFinish() {
  let coords;
  if (attackQueue.length) coords = attackQueue.shift();
  else strategyReset();
  function onMiss(cell) {
    stage = 0;
    attackQueue.length = 0;
    attackIndex = 0;
    discoveredCell = null;
  }
  function onHit(cell) {
  }
  return { coords, onMiss, onHit };
}

function getPathRecursion(
  coords, dir, amount = 10,
  path = [getCoordSides(coords, dir)]
) {
  const nextCoord = getCoordSides(path[path.length - 1], dir);
  if (testIfHitAlready(nextCoord)) return path;
  path.push(nextCoord);
  if (path.length === amount) return path;
  return getPathRecursion(getCoordSides(nextCoord, dir), dir, amount, path);
}

function getCoordSides(coords, dir) {
  const sides = [
    { x: coords.x, y: coords.y - 1 },
    { x: coords.x + 1, y: coords.y },
    { x: coords.x, y: coords.y + 1 },
    { x: coords.x - 1, y: coords.y }
  ]
  if (dir === 0 || dir) return sides[dir];
  return sides;
}

function getRandomCoords() {
  const randomNum = function (num) {
    return Math.floor(Math.random() * num);
  }
  let x = randomNum(11);
  let y = randomNum(11);
  return { x, y };
}

function testIfHitAlready(coordsObject) {
  const recievedAttacks = players['1'].gameboard.recievedAttacks;
  return recievedAttacks.some(cell => cell.x === coordsObject.x && cell.y === coordsObject.y);
}

function constrainCoords(coordsObject) {
  let coordsToConstrain = coordsObject;
  if (!coordsToConstrain) return false;
  if (coordsToConstrain.x > 10) coordsToConstrain.x = 10;
  if (coordsToConstrain.y > 10) coordsToConstrain.y = 10;
  if (coordsToConstrain.x < 0) coordsToConstrain.x = 0;
  if (coordsToConstrain.y < 0) coordsToConstrain.y = 0;
  return coordsToConstrain;
}

function isValidTarget(coordsObject) {
  const rawCoords = coordsObject;
  const constrainedCoords = constrainCoords(rawCoords);
  if (testIfHitAlready(constrainedCoords)) return false;
  if (constrainedCoords === null) return false;
  else return constrainedCoords;
}

function strategyReset() {
  stage = 0;
  attackQueue.length = 0;
  attackIndex = 0;
  discoveredCell = null;
}