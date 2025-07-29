const playerBoards = {
  1: document.querySelector('.gameboard.player-1'),
  2: document.querySelector('.gameboard.player-2'),
}

function updateGameboards(player1, player2) {
  playerBoards['1'].innerHTML = '';
  playerBoards['2'].innerHTML = '';

  insertGrid(player1, playerBoards['1']);
  insertGrid(player2, playerBoards['2']);

  function insertGrid(player, gameboardEl) {
    const grid = document.createElement('div');
    player.gameboard.grid.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.classList.add('row', 'flex');
      row.forEach((cell) => {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        if (cell) {
          cellEl.classList.add('ship')
          if (cell.hits > 0) cellEl.classList.add('ship hit')
        }
        rowEl.append(cellEl);
      })
      gameboardEl.append(rowEl);
    })
  }
}




export { updateGameboards };