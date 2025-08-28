let stage = 0;
let players;

export function initializeCpu(playersArray) {
  players = playersArray;
}

const cpuStrategyStages = [
  cpuStageSearching, cpuStageDiscovery, cpuStageFollowUp, cpuStageFinishOff,
]

export function getCpuAttack() {
  return cpuStrategyStages[stage]();
}

function cpuStageSearching() {
  let randomCoords = getRandomCoords();
  while (testIfHitAlready(randomCoords)) {
    randomCoords = getRandomCoords()
  }

  function onMiss() {
    console.log('Cpu Missed!')
  }

  function onHit() {
    console.log('Cpu Hit!')
  }

  return { coords: randomCoords, onMiss, onHit };
}

function cpuStageDiscovery() {

}

function cpuStageFollowUp() {

}

function cpuStageFinishOff() {

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