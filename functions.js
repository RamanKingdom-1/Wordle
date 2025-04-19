const fs = require('fs');
const readline = require('readline')


var guesses = 0;
var maxGuesses = 5;
var wordCurrent;
var currentGuesses = [];
var holderOfGuessResults = [];
var mapOfWords = new Map();



function pickWord() {
    var words = fs.readFileSync('5_letter_words.txt', 'utf-8')
    .split('\n');
    guesses = 0;
    currentGuesses.clear();
    holderOfGuessResults.clear();
    var random = Math.floor(Math.random() * words.length);
    wordCurrent = words[random];  
    mapOfWords.clear();

    for (var i = 0; i < 5; i++) {
        if (mapOfWords.has(wordCurrent[i])) {
            mapOfWords.set(wordCurrent[i], mapOfWords.get(wordCurrent[i]) + 1);
        } else {
            mapOfWords.set(wordCurrent[i], 1);
        }
    }
    return wordCurrent;
   
}



function guessValid(currentGuess) {
    //N represents nothing
    //Y represents Correct and in the right spot
    //R represents In the word but not in the right spot
    helper = ['N','N','N','N','N'];
    tempMap = new Map(mapOfWords);
    for (var i = 0; i < 5; i++) {
        if (currentGuess[i] == wordCurrent[i]) {
            helper[i] = 'Y';
            tempMap.set(currentGuess[i], tempMap.get(currentGuess[i]) - 1)
        } else if (tempMap.has(currentGuess[i]) && tempMap.get(currentGuess[i]) > 0) {
            helper[i] = 'R';
            tempMap.set(currentGuess[i], tempMap.get(currentGuess[i]) - 1)
        }
    }
    currentGuesses.push(currentGuess);
    holderOfGuessResults.push(helper);
    guesses++;
    return helper;
}   


function gameOver() {
    if (guesses >= maxGuesses) {
        return true;
    }
    return !(holderOfGuessResults[guesses - 1].includes('N') && holderOfGuessResults[guesses - 1].includes('R'));
}

express = require('express');
//const {pickWord, guessValid, gameOver} = require('./functions');
app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.get('/start', (req,res) => {
    word = pickWord();
    res.json({word});
});

app.post('/guess', (req,res) =>  {
    const{currentGuess, wordCurrent} = req.body;
    result = guessValid(currentGuess);
    res.json({result});
});

app.get('/game-over', (req,res) => {
    res.json({gameOver});
});

const port = 3001;
app.listen(port, () => {
    console.log('${port}');
});





