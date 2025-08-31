import fs from "fs";
import express from "express";
import cors from "cors";

let guesses = 0;
const maxGuesses = 6;
let wordCurrent;
let currentGuesses = [];
let holderOfGuessResults = [];
let mapOfWords = new Map();
let mapOfTotalWords = new Map();

function pickWord() {
  const words = fs.readFileSync("5_letter_words.txt", "utf-8").split("\n");
  for (let i = 0; i < words.length; i++) {
    mapOfTotalWords.set(words[i], true);
  }

  guesses = 0;
  currentGuesses = [];
  holderOfGuessResults = [];
  const random = Math.floor(Math.random() * words.length);
  wordCurrent = words[random].trim();
  mapOfWords.clear();

  for (let i = 0; i < 5; i++) {
    if (mapOfWords.has(wordCurrent[i])) {
      mapOfWords.set(wordCurrent[i], mapOfWords.get(wordCurrent[i]) + 1);
    } else {
      mapOfWords.set(wordCurrent[i], 1);
    }
  }
  return wordCurrent;
}

function wordExists(word) {
  if (mapOfTotalWords.has(word)) {
    return "true";
  } else {
    return "false";
  }
}

function guessValid(currentGuess) {
  let helper = ["N", "N", "N", "N", "N"];
  let tempMap = new Map(mapOfWords);
  for (let i = 0; i < 5; i++) {
    if (currentGuess[i] === wordCurrent[i]) {
      helper[i] = "Y";
      tempMap.set(currentGuess[i], tempMap.get(currentGuess[i]) - 1);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (
      helper[i] === "N" &&
      tempMap.has(currentGuess[i]) &&
      tempMap.get(currentGuess[i]) > 0
    ) {
      helper[i] = "R";
      tempMap.set(currentGuess[i], tempMap.get(currentGuess[i]) - 1);
    }
  }

  currentGuesses.push(currentGuess);
  holderOfGuessResults.push(helper);
  guesses++;
  return helper;
}

function isGameOver() {
  if (guesses >= maxGuesses) {
    return true;
  }
  if (guesses === 0) return false;
  // Check if the last guess was a win
  const lastGuess = holderOfGuessResults[guesses - 1];
  if (lastGuess && lastGuess.every((x) => x === "Y")) {
    return true; // Game over because you won!
  }
  return false; // Game continues
}

const app = express();

app.use(express.json());
app.use(cors());

app.get("/start", (req, res) => {
  const word = pickWord();
  res.json({ message: "Game Start" });
});

app.post("/valid", (req, res) => {
  const { currentGuess } = req.body;
  const result = wordExists(currentGuess);
  res.json({ result });
});

app.post("/guess", (req, res) => {
  const { currentGuess } = req.body;
  const result = guessValid(currentGuess);
  res.json({ result });
});

app.get("/game-over", (req, res) => {
  const gameOver = isGameOver();
  const won =
    guesses > 0 &&
    holderOfGuessResults[guesses - 1] &&
    holderOfGuessResults[guesses - 1].every((x) => x === "Y");
  res.json({
    gameOver: gameOver,
    won: won,
    wordCurrent: wordCurrent,
    guesses: guesses,
    maxGuesses: maxGuesses,
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
