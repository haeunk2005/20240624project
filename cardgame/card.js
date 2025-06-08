const allCardsData = [
    { name: "dog", img: "../images/dog.jpg" },
    { name: "cat", img: "../images/cat.jpg" },
    { name: "rabbit", img: "../images/rabbit.jpg" },
    { name: "fox", img: "../images/fox.jpg" },
    { name: "lion", img: "../images/lion.jpg" },
    { name: "panda", img: "../images/panda.jpg" },
    { name: "goat", img: "../images/goat.jpg" },
    { name: "penguin", img: "../images/penguin.jpg" },
    { name: "bird", img: "../images/bird.jpg" },
    { name: "squirrel", img: "../images/squirrel.jpg" }
  ];
  
  let selectedPairs = 6; // 기본은 중급
  let cards = [];
  let flippedCards = [];
  let matchedCount = 0;
  let lockBoard = false;
  
  const gameBoard = document.getElementById("gameBoard");
  const message = document.getElementById("message");
  const resetBtn = document.getElementById("reset");
  const difficultyButtons = document.querySelectorAll(".difficulty");
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function createBoard() {
    gameBoard.innerHTML = "";
    message.textContent = "";
    matchedCount = 0;
    flippedCards = [];
    lockBoard = true;
  
    const chosenCards = allCardsData.slice(0, selectedPairs);
    cards = shuffle([...chosenCards, ...chosenCards]);
  
    const columnCount = Math.ceil(Math.sqrt(cards.length));
    gameBoard.style.gridTemplateColumns = `repeat(${columnCount}, 100px)`;
  
    cards.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card", "flipped");
      cardElement.dataset.name = card.name;
  
      cardElement.innerHTML = `
        <div class="card-inner">
          <div class="card-front"><img src="${card.img}" alt="${card.name}"></div>
          <div class="card-back">?</div>
        </div>
      `;
  
      cardElement.addEventListener("click", () => flipCard(cardElement));
      gameBoard.appendChild(cardElement);
    });
  
    // 1초 후 카드 자동 뒤집기
    setTimeout(() => {
      document.querySelectorAll(".card").forEach(card => card.classList.remove("flipped"));
      lockBoard = false;
    }, 1000);
  }
  
  function flipCard(card) {
    if (lockBoard || card.classList.contains("flipped") || flippedCards.length === 2) return;
  
    card.classList.add("flipped");
    flippedCards.push(card);
  
    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
  
  function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.name === card2.dataset.name;
  
    if (isMatch) {
      matchedCount++;
      flippedCards = [];
      if (matchedCount === selectedPairs) {
        message.textContent = "You Win!";
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }
  
  resetBtn.addEventListener("click", createBoard);
  
  difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedPairs = parseInt(button.dataset.pairs);
      createBoard();
    });
  });
  
  createBoard();
  