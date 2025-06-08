const board = document.getElementById('game-board');
const messageBox = document.getElementById('message-box');
const minesLeftDisplay = document.getElementById('mines-left');

let rows = 9;
let cols = 9;
let mines = 10;
let gameOver = false;
let grid = [];
let minePositions = [];
let flagsPlaced = 0;

function setDifficulty(level) {
  if (level === 'easy') {
    rows = 9; cols = 9; mines = 10;
  } else if (level === 'medium') {
    rows = 16; cols = 16; mines = 40;
  } else if (level === 'hard') {
    rows = 16; cols = 30; mines = 99;
  }
  initGame();
}

function initGame() {
  board.innerHTML = '';
  messageBox.textContent = '';
  minesLeftDisplay.textContent = mines;
  gameOver = false;
  flagsPlaced = 0;
  grid = [];
  minePositions = [];

  board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      board.appendChild(cell);

      grid[y][x] = {
        element: cell,
        hasMine: false,
        revealed: false,
        flagged: false,
        count: 0
      };

      cell.addEventListener('click', () => handleClick(x, y));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(x, y);
      });
    }
  }

  placeMines();
  calculateNumbers();
}

function placeMines() {
  while (minePositions.length < mines) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!grid[y][x].hasMine) {
      grid[y][x].hasMine = true;
      minePositions.push([x, y]);
    }
  }
}

function calculateNumbers() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].hasMine) continue;

      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
            if (grid[ny][nx].hasMine) count++;
          }
        }
      }
      grid[y][x].count = count;
    }
  }
}

function handleClick(x, y) {
  if (gameOver || grid[y][x].revealed || grid[y][x].flagged) return;

  const cell = grid[y][x];
  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.hasMine) {
    cell.element.classList.add('bomb');
    cell.element.textContent = '💣';
    endGame(false);
  } else {
    if (cell.count > 0) {
      cell.element.textContent = cell.count;
    } else {
      revealEmptyCells(x, y);
    }
    checkWin();
  }
}

function revealEmptyCells(x, y) {
  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    const cell = grid[cy][cx];
    if (cell.revealed || cell.hasMine || cell.flagged) continue;

    cell.revealed = true;
    cell.element.classList.add('revealed');

    if (cell.count > 0) {
      cell.element.textContent = cell.count;
    } else {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
            stack.push([nx, ny]);
          }
        }
      }
    }
  }
}

function toggleFlag(x, y) {
  if (gameOver || grid[y][x].revealed) return;
  const cell = grid[y][x];

  if (cell.flagged) {
    cell.flagged = false;
    cell.element.classList.remove('flagged');
    cell.element.textContent = '';
    flagsPlaced--;
  } else {
    if (flagsPlaced < mines) {
      cell.flagged = true;
      cell.element.classList.add('flagged');
      cell.element.textContent = '🚩';
      flagsPlaced++;
    }
  }

  minesLeftDisplay.textContent = mines - flagsPlaced;
}

function endGame(win) {
  gameOver = true;
  messageBox.textContent = win ? '🎉 You Win!' : '💥 You Lose';

  if (!win) {
    minePositions.forEach(([x, y]) => {
      const cell = grid[y][x];
      if (!cell.revealed) {
        cell.element.classList.add('bomb');
        cell.element.textContent = '💣';
      }
    });
  }
}

function checkWin() {
  let revealedCount = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].revealed) revealedCount++;
    }
  }
  if (revealedCount === rows * cols - mines) {
    endGame(true);
  }
}

initGame();
