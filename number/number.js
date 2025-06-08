let answer;
let attempts;

function resetGame() {
  answer = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  document.getElementById("message").textContent = "숫자를 입력하고 \"확인\"을 누르세요";
  document.getElementById("guessInput").value = "";
}

document.getElementById("checkBtn").addEventListener("click", () => {
  const guess = parseInt(document.getElementById("guessInput").value);
  const message = document.getElementById("message");

  if (isNaN(guess) || guess < 1 || guess > 100) {
    message.textContent = "1부터 100 사이의 숫자를 입력하세요!";
    return;
  }

  attempts++;

  if (guess < answer) {
    message.textContent = "지정 숫자보다 낮습니다";
  } else if (guess > answer) {
    message.textContent = "지정 숫자보다 높습니다";
  } else {
    message.textContent = `예측 성공! 시도 횟수: ${attempts}번`;
  }
});

document.getElementById("resetBtn").addEventListener("click", resetGame);

resetGame(); // 초기 실행
