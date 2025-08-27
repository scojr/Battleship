let stage = 0;
let players;

export function initializeCpu(playersArray) {
  players = playersArray;
}

const cpuStrategyStages = [
  cpuSearching, cpuDiscovery, cpuFollowUp, cpuFinishOff,
]

export function getCpuAttack() {
  return cpuStrategyStages[stage]();
}

function cpuSearching() {
  let randomCoords = getRandomCoords();
  while (testIfHitAlready(randomCoords)) {
    randomCoords = getRandomCoords()
  }
  return randomCoords;
}

function cpuDiscovery() {

}

function cpuFollowUp() {

}

function cpuFinishOff() {

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