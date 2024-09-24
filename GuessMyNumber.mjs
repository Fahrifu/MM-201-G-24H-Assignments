import readline from 'readline';

// English or Norwegian
const translations = {
    en: {
        welcome: "Welcome to the Guess My Number",
        prompt: "Guess a number between 1 and 100: ",
        tooHigh: "Too high! Try Again",
        tooLow: "Too Low! Try Again",
        correct: "Congratulations! You guessed the number",
        playAgain: "Do you want to play again? (yes/no): ",
        invalid: "Please enter a valid number",
        thanks: "Thanks for playing!"
    },
    no: {
        welcome: "Velkommen til Guess My Number",
        prompt: "Gjett et tall mellom 1 og 100: ",
        tooHigh: "For høyt! Prøv igjen.",
        tooLow: "For lavt! Prøv igjen.",
        correct: "Gratulerer! Du gjettet tallet: ",
        playAgain: "Vil du spille igjen? (ja/nei): ",
        invalid: "Vennligst skriv inn et gyldig tall.",
        thanks: "Takk for at du spilte!"
    }
};
// Just there for node.js interfaces with terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function startGame() {
    //Language Selection
    let language = await askQuestion("Choose your language: 'en' for English, 'no' for Norwegian: ").then(lang => lang.toLowerCase());

    if(!translations[language]) {
        console.log("Language not supported. Defaulting to English");
        language = 'en';
    }

    const text = translations[language];
    console.log(text.welcome);

    //Generate Number
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    let playerGuess = "";

    while (playerGuess != randomNumber) {
        playerGuess = await askQuestion(text.prompt);

//If player decide to add "," in there numbers
        if (isNaN(playerGuess.trim())) {
            console.log(text.invalid);
            continue;
        }
        
        playerGuess = parseInt(playerGuess.trim());

// Higher or Lower
        if (playerGuess > randomNumber) {
            console.log(text.tooHigh);
        } else if (playerGuess < randomNumber) {
            console.log(text.tooLow);
        } else {
            console.log(`${text.correct}${randomNumber}`);
        }
    }

// Play Again
    let playAgain = await askQuestion(text.playAgain);

    if (playAgain.toLowerCase() === 'yes' || playAgain.toLowerCase() === 'ja') {
        startGame();
    } else {
        console.log(text.thanks);
        process.exit(0);
    }
}

startGame(); //test