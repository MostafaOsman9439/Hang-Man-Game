// Words
const wordsBank = {
  Programming: ["JavaScript", "Python", "Mysql", "plusplus", "Fortran"],
  Countries: ["Egypt", "Palestine", "Syria", "Bahrain", "Yemen"],
  Movies: ["Inception", "Interstellar", "Whiplash", "Prestige"],
};

// The State
const gameState = {
  word: "", // The Chosen Word
  category: "",
  guessedLetters: [], // Clicked Letters
  wrongAttempts: 0, // Mistakes
  maxAttempts: 9, // Number Of Tries Depends On The Number Of The Body Parts I Made
  score: 0,
  hintsUsed: 0,
  maxHints: 0,
};

function resetHangmanDraw() {
  // HangMan Game Parts (CSS)
  const bodyParts = [
    ".stand",
    ".top-bar",
    ".rope",
    ".head",
    ".body",
    ".left-arm",
    ".right-arm",
    ".left-leg",
    ".right-leg",
  ]; // Adding Class For Each Part To Make Them Disappear
  bodyParts.forEach((partClass) => {
    const part = document.querySelector(partClass);
    if (part) {
      part.style.display = "none";
    }
  });
}

// The Parts
function updateHangmanVisuals() {
  const bodyParts = [
    ".stand",
    ".top-bar",
    ".rope",
    ".head",
    ".body",
    ".left-arm",
    ".right-arm",
    ".left-leg",
    ".right-leg",
  ]; // Checking Which Part Are We Going to Show Depends On The Number Of The Mistakes

  // WrongAttempts Starts From 1 But The Index Starts With 0 So We -1 So it Starts With The First Part Not The Second One
  const currentPartClass = bodyParts[gameState.wrongAttempts - 1];
  const partElement = document.querySelector(currentPartClass); // Saving The CurrentPartClass In The Part Element

  if (partElement) {
    partElement.style.display = "block"; // To Make It Appear (Changing The Display: none; To "Block")
  }
}

function checkWin() {
  const slots = document.querySelectorAll(".letter-slot"); // Creating Variable For The Slots
  const isWon = Array.from(slots).every((slot) => slot.innerHTML !== ""); // checking If All The Slots Are Full Or Not?
  // If The Slots Are Full And Not Empty
  if (isWon && gameState.word !== "") {
    // maxAttempts = 9 Attempts = 9 * 10 = 90 - wrongAttempts = Depends On The Number Of The Mistakes * 10
    // So If maxAttempts = 9 And wrongAttempts = 5 Then His/Her Score Will Be = 40 Points
    const pointsEarned = (gameState.maxAttempts - gameState.wrongAttempts) * 10;
    // Adding The Current Score + The New Score
    gameState.score += pointsEarned;

    setTimeout(() => {
      alert(
        `Congratulations! You won! 🎉\nEarned: ${pointsEarned} points\nTotal Score: ${gameState.score}`,
      );
      initGame();
    }, 200);
  }
}

// Checking The Number Of Mistakes
function checkLoss() {
  // No Need For Comments Here It Is So Clear Ngl
  if (gameState.wrongAttempts >= gameState.maxAttempts) {
    gameState.score -= 20;

    if (gameState.score <= 0) {
      gameState.score = 0;
    }

    setTimeout(() => {
      alert("Game Over! The word was: " + gameState.word.toUpperCase());
      initGame();
    }, 200);
  }
}

function initGame() {
  resetHangmanDraw(); // Choosing Random Word From Random Category
  const categories = Object.keys(wordsBank);
  gameState.category =
    categories[Math.floor(Math.random() * categories.length)];
  const words = wordsBank[gameState.category];
  gameState.word =
    words[Math.floor(Math.random() * words.length)].toLowerCase();

  // Making Sure The Game Starts With 0 Guessed Letters And 0 Mistakes
  gameState.guessedLetters = [];
  gameState.wrongAttempts = 0;

  const hintBtn = document.getElementById("hint-btn");
  if (hintBtn) {
    hintBtn.disabled = false;
    hintBtn.innerText = "Hint 💡";
  }

  gameState.hintsUsed = 0; // Making Sure The Game Starts With 0 Hints
  gameState.maxHints = Math.floor(gameState.word.length / 3); // The Number Of The Hints Depends On The Number Of The Letters
  document.getElementById("hints-count").innerHTML = `0/${gameState.maxHints}`; // Shows The Number Of The Hints Left Or He/She Got
  
  document.getElementById("game-score").innerHTML = gameState.score; // Showing The Score ^-^

  document.getElementById("category-name").innerHTML = gameState.category; // Shows The Chosen Category In The Span ("Category-name")

  renderWord();
  generateKeyboard();
}

function renderWord() {
  // Making Variable For The Word Section (Word-display)
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.innerHTML = ""; // Making Sure It Is Empty
  // Creating Spans For Each Letter Does The Word Has + Adding A Class Name For Them
  Array.from(gameState.word).forEach((letter) => {
    const span = document.createElement("span");
    span.className = "letter-slot";
    // Checking If The Guessed Letter Is One Of The Chosen Word Letters Or If The Letter Is Space
    if (gameState.guessedLetters.includes(letter) || letter === " ") {
      span.innerHTML = letter; // Put It In The Span
    } else {
      span.innerHTML = ""; // Else Keep The Spans (Slots) Empty
    }
    wordDisplay.appendChild(span); // Putting The Spans (Slots) Inside The WordDisplay
  });
}

function generateKeyboard() {
  const keyboard = document.getElementById("keyboard"); // Creating Empty Keyboard
  keyboard.innerHTML = ""; // Making Sure It IS Empty
  const letters = "abcdefghijklmnopqrstuvwxyz"; // Putting Letters Into An Array
  Array.from(letters).forEach((letter) => {
    const button = document.createElement("button"); // Creating The Buttons
    button.innerHTML = letter; // Putting The Letter Into The Buttons
    button.className = "key"; // Adding Class To The Buttons
    // Waiting Until Someone Clicks A Button So The Function Starts
    button.onclick = () => handleGuess(letter, button);
    keyboard.appendChild(button); // Adding The Button Into My Empty Keyboard
  });
}

function handleGuess(letter, buttonElement) {
  if (gameState.guessedLetters.includes(letter)) return; // If The Guessed Letter Is Right
  // Adding Guessed Letter To The Game State (In His Right Slot)
  gameState.guessedLetters.push(letter);

  buttonElement.disabled = true; // Disabling The Clicked Letters So He/She Cant Guess The Same Letter Twice
  buttonElement.classList.add("clicked"); // Adding Class For The Clicked Letters

  if (gameState.word.includes(letter)) {
    playSound("success"); // Adding Success Sound
    // If Right Updating / Deleting All The Slots
    // Then Adds The New Slots With The Right Guessed Letters
    renderWord();
    checkWin(); // Checking If He/She Won?
  } else {
    gameState.wrongAttempts++;
    playSound("fail"); // Adding Fail Sound
    // Displaying A Part Of The Hang/Man Depends On The Number Of The Mistakes
    updateHangmanVisuals();
    checkLoss(); // Checking If He/She Lost?
  }
}

function playSound(type) {
  const sound = document.getElementById(`${type}-sound`); // Making The Function Search For Which Sound To Use Depends On If The User Guess Is Right Or Wrong
  if (sound) {
    sound.currentTime = 0; // To Make The Sound Stops If The User Kept Playing Before it Ends
    sound.play().catch((e) => console.log("Sound play prevented")); // So If The Browser Didn't Let The Sound Play The Game Doesn't Crash
  }}

function getHint() {
  // So They Cant Exceed The Hint Limit
  if (gameState.hintsUsed >= gameState.maxHints) return;
  // For The Repeating Letters So They Don't Get 2 Hints (Same Letter In The Word) By Only Using One Hint (Set)
  const uniqueLetters = [...new Set(Array.from(gameState.word))];
  // Filtering The Word And Getting The Remaining Letters
  const remainingLetters = uniqueLetters.filter((letter) => {
    return !gameState.guessedLetters.includes(letter);
  });
  // Checking If The Remaining letter = 0 (ll T2myn bas) So The Hint Button Doesn't Give Us Undefined And Lags
  if (remainingLetters.length === 0) {
    return;
  }
  // Getting Random Remaining Letter When Pressing The Hint Button
  const randomLetter =
    remainingLetters[Math.floor(Math.random() * remainingLetters.length)];
  // Putting The Random Letter (The Hint) Inside The Slots His Right Place
  gameState.guessedLetters.push(randomLetter);
  // Increasing The USed Hints So It doesn't Exceed The Limit
  gameState.hintsUsed++;
  // Remaking The Slots With The Hint We Gave
  renderWord();

  // Disabling The Hint Button When There Is No Hints Left
  if (gameState.hintsUsed >= gameState.maxHints) {
    const hintBtn = document.getElementById("hint-btn");
    if (hintBtn) {
      hintBtn.disabled = true;
      hintBtn.innerText = "No Hints Left 🔒";
    }
  }
  document.getElementById("hints-count").innerHTML =
    `${gameState.hintsUsed}/${gameState.maxHints}`;
  checkWin();
}

window.onload = initGame;
