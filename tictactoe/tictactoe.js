const board = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");
const turnIndicator = document.getElementById("turn-indicator");

let cells = [];
let currentPlayer = "X";
let gameOver = false;

// 승리 조건
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
  [0, 4, 8], [2, 4, 6]             // 대각선
];

function createBoard() {
  board.innerHTML = "";
  cells = [];
  gameOver = false;
  message.textContent = "";
  message.classList.remove("show");
  currentPlayer = "X";
  updateTurnIndicator();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(index) {
  if (gameOver || cells[index].textContent !== "") return;

  cells[index].textContent = currentPlayer;
  // 현재 플레이어에 따라 클래스 지정 (x 또는 o)
  cells[index].classList.add(currentPlayer.toLowerCase());

  if (checkWin(currentPlayer)) {
    showMessage(`${currentPlayer} 승리!`);
    gameOver = true;
    turnIndicator.textContent = "";
  } else if (cells.every(cell => cell.textContent !== "")) {
    showMessage("무승부!");
    gameOver = true;
    turnIndicator.textContent = "";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnIndicator();
  }
}

function checkWin(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index].textContent === player)
  );
}

function updateTurnIndicator() {
  turnIndicator.textContent = `현재 턴: ${currentPlayer}`;
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add("show");
}

resetBtn.addEventListener("click", createBoard);

createBoard();
