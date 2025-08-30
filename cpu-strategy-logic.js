let stage = 0;
let players;
const attackQueue = [];
let attackIndex = 0;

export function initializeCpu(playersArray) {
  players = playersArray;
}

const cpuStrategyStages = [
  cpuStageSearching, cpuStageDiscovery, cpuStageFollowUp, cpuStageFinishOff,
]

export function getCpuAttack() {
  console.log({ stage })
  let cpuAttack = cpuStrategyStages[stage]();
  while (!isValidTarget(cpuAttack.coords)) {
    cpuAttack = cpuStrategyStages[stage]();
  }
  return cpuAttack
}

function cpuStageSearching() {
  let randomCoords = getRandomCoords();

  function onMiss(cell) {
  }
  function onHit(cell) {
    attackQueue.push(...getCoordSides(cell))
    stage = 1;
  }
  return { coords: randomCoords, onMiss, onHit };
}

function cpuStageDiscovery() {
  console.log(attackQueue.slice())
  const coords = attackQueue.shift();
  function onMiss(cell) {
    console.log('miss', attackQueue)
    attackIndex++;
  }
  function onHit(cell) {
    console.log('hit', attackQueue)
    stage = 2;
  }
  return { coords, onMiss, onHit };
}

function cpuStageFollowUp() {

  function onMiss(cell) {
    console.log('stage-2 miss')
  }
  function onHit(cell) {
    console.log('stage-2 hit')
  }
  return { coords: null, onMiss, onHit };

}

function cpuStageFinishOff() {

}

function getPathRecursion(coords, dir, amount = 10, path = [getCoordSides(coords, dir),]) {
  console.log(path)
  const nextCoord = getCoordSides(path[path.length - 1], dir);
  if (path.length === amount) return path;
  return getPathRecursion(nextCoord, dir, path, amount);
}

const myCoord = { x: 1, y: 1 };
const coordSide = getCoordSides(myCoord, 1)
console.log(coordSide);

function getCoordSides(coords, dir) {
  const sides = [
    { x: coords.x, y: coords.y - 1 },
    { x: coords.x + 1, y: coords.y },
    { x: coords.x, y: coords.y + 1 },
    { x: coords.x - 1, y: coords.y }
  ]
  if (dir) return sides[dir];
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
  console.log(coordsObject);
  let coordsToConstrain = coordsObject;
  if (coordsToConstrain.x > 10) coordsToConstrain.x = 10;
  if (coordsToConstrain.y > 10) coordsToConstrain.y = 10;
  if (coordsToConstrain.x < 0) coordsToConstrain.x = 0;
  if (coordsToConstrain.y < 0) coordsToConstrain.y = 0;
  console.log(coordsToConstrain);
  return coordsToConstrain;
}

function isValidTarget(coordsObject) {
  const rawCoords = coordsObject;
  const constrainedCoords = constrainCoords(rawCoords);
  if (testIfHitAlready(constrainedCoords)) return false;
  else return constrainedCoords;
}