const wordsArray = [
  "apple",
  "grape",
  "water",
  "table",
  "chair",
  "light",
  "music",
  "dance",
  "happy",
  "smile",
  "heart",
  "cloud",
  "brush",
  "green",
  "house",
  "sweet",
  "sleep",
  "dream",
  "hello",
  "world",
];

let gameInterval;
let wordToGuess = [];
let correct = 0;
let wrong = 0;

document.getElementById("newgame").addEventListener("click", handleGameStart);

function handleGameStart() {
  const gameContainer = document.querySelector(".game-container");
  const startContainer = document.querySelector(".start-container");

  gameContainer.style.display = "flex";
  startContainer.style.display = "none";

  clearInterval(gameInterval);
  resetGame();
  startGame();
}

function resetGame() {
  wordToGuess = [];
  correct = 0;
  wrong = 0;

  document.getElementById("correct").textContent = correct;
  document.getElementById("wrong").textContent = "♥️♥️♥️";
  document.querySelector(".word-container").style.color = "#fff";

  let inputField = document.getElementById("input-field");
  inputField.value = "";
  inputField.style.display = "block";
}

function startGame() {
  wrong = 0;
  correct = 0;
  console.log("GAME HAS STARTED!");
  resetGame();

  let inputField = document.getElementById("input-field");
  inputField.focus();

  gameInterval = setInterval(displayWord, 1000);

  setTimeout(endGame, 20000);

  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkWords();
    }
  });
}

function displayWord() {
  const randomIndex = Math.floor(Math.random() * wordsArray.length);
  const randomWord = wordsArray[randomIndex];
  const wordContainer = document.querySelector(".word-container");

  if (isGameOver()) {
    clearInterval(gameInterval);

    wordContainer.textContent = "GAME OVER!";
    wordContainer.style.color = "#e63946";

    endGame();
    return;
  }

  wordToGuess.push(randomWord);
  wordContainer.textContent = randomWord.toUpperCase();
}

function endGame() {
  const newGame = document.getElementById("newgame");
  let inputField = document.getElementById("input-field");
  inputField.style.display = "none";
  newGame.style.display = "block";
}

function checkWords() {
  if (isGameOver()) {
    endGame();
    return;
  }

  let correctScore = document.getElementById("correct");
  let wrongScore = document.getElementById("wrong");
  const enteredWord = document
    .getElementById("input-field")
    .value.toLowerCase();

  if (wordToGuess.includes(enteredWord)) {
    correct += 1;
    correctScore.textContent = correct;
  } else {
    wrong += 1;
    if (wrong === 1) {
      wrongScore.textContent = "♥️♥️";
    } else if (wrong === 2) {
      wrongScore.textContent = "♥️";
    } else if (wrong === 3) {
      wrongScore.textContent = "💀";
    }
  }

  document.getElementById("input-field").value = "";
}

function isGameOver() {
  return correct === 3 || wrong > 2 || wordToGuess.length === 19;
}

function resetGame() {
  wordToGuess = [];
  correct = 0;
  wrong = 0;

  document.getElementById("correct").textContent = correct;
  document.getElementById("wrong").textContent = "♥️♥️♥️";
  document.querySelector(".word-container").style.color = "#fff";

  let inputField = document.getElementById("input-field");
  inputField.value = "";
  inputField.style.display = "block";

  document.getElementById("newgame").style.display = "none";
}

document.getElementById("newgame").addEventListener("click", handleGameStart);
