const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;

const GUESSED_WORD_EVENT = "guessedWord";
const GUESS_EVENT = "guess";
const JOIN_EVENT = "join";
const CONNECTION_EVENT = "connection";

/* MIDDLEWARE ADD PUBLIC FOLDER */
app.use(express.static("public"));

const wordsToGuess = ["javascript", "python", "go", "ruby", "rust"];

const users = {};

let wordToGuess;
// let placeholders = wordsToGuess.split("").map(()=> "_").join(" ");
// let placeholder = wordToGuess.replace(/./g,"_")
let guessedWord;

const setNextWord = (word) => {
  word = wordsToGuess[parseInt(Math.random() * wordsToGuess.length)];
  wordToGuess = word;
  guessedWord = word.split("").fill("_");
};

setNextWord();

const getGuessedWord = () => {
  return guessedWord.join("");
};

const emitGuessedWord = (channel) => {
  channel.emit(GUESSED_WORD_EVENT, getGuessedWord());
};

io.on(CONNECTION_EVENT, (socket) => {
  console.log("a user connected");

  emitGuessedWord(socket);

  socket.on(JOIN_EVENT, (username) => {
    users[socket.id] = {
      username,
    };
    console.log(users);
  });

  socket.on(GUESS_EVENT, (letter) => {
    let isCorrectGuess = false;

    /*     for(let i = 0; i < wordsToGuess.length; i++){
      const char = wordToGuess[i];

      if(char === letter){
        placeholder[i] = letter;
        isCorrectGuess = true;
      }
    } */

    [...wordToGuess].forEach((char, i) => {
      if (char === letter) {
        guessedWord[i] = letter;
        isCorrectGuess = true;
      }
    });
    if (isCorrectGuess) {
      if (!guessedWord.includes("_")) {
        setNextWord();
      }
      emitGuessedWord(io);
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
