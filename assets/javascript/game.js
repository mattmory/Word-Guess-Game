// Global variables
var displayWC = document.getElementById("win-count");
var displayLC = document.getElementById("loss-count");
var displayRGC = document.getElementById("remaining-guess-count");
var displayUG = document.getElementById("used-guesses");
var displayCW = document.getElementById("current-word");

// Main wordGuessGame Object
var wordGuessGame = {

    init: function () {
        // Set the internal variables
        this.winCount = 0;
        this.lossCount = 0;
        this.usedGuesses = [];
        this.currentWord = [];
        this.displayWord;
        this.displayWordArray = [];
        this.wordList;
        this.unSolvedLetterCount;
        this.remainingGuesses = 9;
        // Populate the Original Screen
        displayWC.textContent = this.winCount;
        displayLC.textContent = this.lossCount;
        // Run the Initialization Functions
        this.loadQuestions();
        this.nextQuestion();

    },

    // This will return "NEXTLETTER" - "USEDLETTER" - "LOSS" - "WIN" - "GAMEOVER"
    // Returns can be ignored or used for formatting the display.
    letterGuess: function (guess) {
        // Take the guess and check it out.
        if (this.usedGuesses.indexOf(guess.toLowerCase()) != -1) {
            return "USEDLETTER";
        }
        // See if it's in the array
        else if (this.currentWord.indexOf(guess.toLowerCase()) != -1) {
            this.remainingGuesses--;
            this.usedGuesses.push(guess.toLowerCase());
            this.formatWordDisplay(guess);
        }
        // Not in, not guessed, must be a miss.
        else {
            this.remainingGuesses--;
            this.usedGuesses.push(guess.toLowerCase());
        }
        // Update first part of the display
        displayUG.textContent = this.formatUsedGuesses();
        displayRGC.textContent = this.remainingGuesses;
        displayCW.textContent = this.displayWord;

        // Check to see if the word is solved and if any words remain
        if (this.unSolvedLetterCount === 0 && this.wordList.length === 0) {
            this.winCount++;
            displayWC.textContent = this.winCount;
            return "GAMEOVER";
        }
        // Check to see if the word is solved, request the next question
        else if (this.unSolvedLetterCount === 0) {
            this.winCount++;
            displayWC.textContent = this.winCount;
            this.nextQuestion();
            return "WIN";
        }
        // Check to see if the word is unsolved, no guesses remain, and if any words remain
        else if (this.unSolvedLetterCount > 0 && this.wordList.length === 0 && this.remainingGuesses === 0 ) {
            this.lossCount++;
            displayLC.textContent = this.lossCount;
            return "GAMEOVER";
        }
        // Check to see if the word is unsolved, no guesses remain, and if any words remain
        else if (this.unSolvedLetterCount > 0 && this.remainingGuesses === 0 ) {
            this.lossCount++;
            displayLC.textContent = this.lossCount;
            this.nextQuestion();
            return "LOSS";
        }
        return "NEXTLETTER";
    },

    nextQuestion: function () {
        //reset remaining guesses
        this.remainingGuesses = 9;
        // Get a randmon index from the array
        var ranIndex = Math.floor(Math.random() * this.wordList.length);
        // Turn the word into an array and set the display words to _ _ _ _
        this.unSolvedLetterCount = this.wordList[ranIndex].word.length;
        this.currentWord = this.wordList[ranIndex].word.split('');
        this.displayWord = "";
        this.displayWordArray = [];
        for (var i = 0; i < this.currentWord.length; i++) {
            this.displayWordArray.push("_");
            this.displayWord = this.displayWord + "_*";
        }
        // remove that extra space from the end of display word
        this.displayWord = this.displayWord.substr(0,this.displayWord.length-1);
        // Remove this word from the array.
        this.wordList.splice(ranIndex, 1);
        //Blank out the guesses
        this.usedGuesses = [];
        // Build the Screen
        displayUG.textContent = this.usedGuesses;
        displayRGC.textContent = this.remainingGuesses;
        displayCW.textContent = this.displayWord;
    },

    formatUsedGuesses: function () {
        var csvString = "";
        var iMax = this.usedGuesses.length;
        for (var i = 0; i < iMax; i++) {
            csvString += this.usedGuesses[i] + ", ";
        }
        // remove the extra ", " from the string's end
        return csvString.substr(0, csvString.length - 2);

    },

    // This goes through and updates the visable word string.
    formatWordDisplay: function (guess) {
        var indexOfGuess;
        while (this.currentWord.indexOf(guess.toLowerCase()) != -1) {
            indexOfGuess = this.currentWord.indexOf(guess.toLowerCase());
            this.displayWordArray[indexOfGuess] = this.currentWord[indexOfGuess];
            this.currentWord[indexOfGuess] = "@";
            this.unSolvedLetterCount--;
        }
        this.displayWord = "";
        for (var i = 0; i < this.displayWordArray.length; i++) {
            this.displayWord = this.displayWord + this.displayWordArray[i] + "*";
        }
        // Remove that extra space from the displayword.
        this.displayWord = this.displayWord.substr(0,this.displayWord.length-1);
    },

    loadQuestions: function () {
        this.wordList = [
            { word: "word1", used: false },
            { word: "word2", used: false },
            { word: "word3", used: false },
            { word: "word4", used: false },
            { word: "word5", used: false }];
    }
};


// Create and Initialize the Game.
var newGame = Object.create(wordGuessGame);
newGame.init();

//Call the letterGuess function.
document.onkeyup = function (event) {
    var returnValue = "";
    var userGuess = event.key;
    returnValue = newGame.letterGuess(userGuess);
    if(returnValue === "GAMEOVER") {
        alert("Game Over. Wins: " + newGame.winCount + ", Losses: " + newGame.lossCount)
    }
};