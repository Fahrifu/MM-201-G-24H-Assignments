import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';


const words = ['conclusion', 'suit', 'confidence', 'insert', 'slide']
let chosenWord = words[Math.floor(Math.random() * words.length)];
let hiddenWord = Array(chosenWord.length).fill('_');
let remainingLives = 10;
let guessedLetter = [];
let incorrectGuesses = [];
let totalGuesses = 0;

const rl = createInterface({ input, output });

const hangmanStages = [
    `

    
    
    
    
    
                 `,
    (`\x1b[32m

    
    
    
    
    
    =========\x1b[0m`), 
    (`\x1b[32m
     
         |
         |
         |
         |
         |
    =========\x1b[0m`),
    (`\x1b[32m
     +---+
         |
         |
         |
         |
         |
    =========\x1b[0m`),
    (`\x1b[32m
      +---+
      |   |
          |
          |
          |
          |
    =========\x1b[0m`), 
    (`\x1b[32m
      +---+
      |   |
      O   |
          |
          |
          |
    =========\x1b[0m`), 
    (`\x1b[32m
      +---+
      |   |
      O   |
      |   |
          |
          |
    =========\x1b[0m`), 
    (`\x1b[32m
      +---+
      |   |
      O   |
     /|   |
          |
          |
    =========\x1b[0m`),
    (`\x1b[31m
      +---+
      |   |
      O   |
     /|\  |
          |
          |
    =========\x1b[0m`),
    (`\x1b[31m
      +---+
      |   |
      O   |
     /|\  |
     /    |
          |
    =========\x1b[0m`), 
    (`\x1b[31m
      +---+
      |   |
      O   |
     /|\  |
     / \  |
          |
    =========\x1b[0m`)];

console.log('Welcome to Hangman!');
console.log('Your word is: ' + hiddenWord.join(' ') + '\n');

const promptUser = async () => {
    const choice = await rl.question('Would you like to guess a [letter] or the [word]? ');

    if (choice.toLowerCase() === 'letter') {
        await promptLetterGuess();
    } else if (choice.toLowerCase() === 'word') {
        await promptWordGuess();
    } else {
        console.log('Please enter "letter" or "word".')
        await promptUser();
    }
};

const promptLetterGuess = async () => {
    const letter = await rl.question('Guess a letter: ');

    if (letter.length !== 1 || !letter.match(/[a-z]/i)) {
        console.log('Please enter a valid single letter.');
        return await promptLetterGuess();
    }

    totalGuesses++;

    if (guessedLetter.includes(letter)) {
        console.log('You already guessed that letter.');
        return await promptLetterGuess();
    }

    guessedLetter.push(letter);

    if (chosenWord.includes(letter)) {
        console.log('Correct guess!');
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                hiddenWord[i] = letter;
            }
        }
    } else {
        remainingLives--;
        incorrectGuesses.push(letter);
        console.log('Incorrect guess! You have ' + remainingLives + ' lives left.');
        console.log(hangmanStages[10 - remainingLives]);
    }

    console.log(hiddenWord(' ') + '\n');

    if (!hiddenWord.includes('_')) {
        console.log('Congratulations, you won! The word was: ' + chosenWord);
        displayStats();
        return rl.close();
    }

    if (remainingLives === 0) {
        console.log('Game Over! The word was: ' + chosenWord);
        console.log(hangmanStages[10]);
        displayStats();
        return rl.close();
    }

    await promptUser();
};

const promptWordGuess = async () => {
    const wordGuess = await rl.question('Guess the word: ');

    totalGuesses++;

    if (wordGuess.toLowerCase() === chosenWord) {
        console.log('Congratulation, you won! The word was: ' + chosenWord);
        displayStats();
        rl.close();
    } else {
        remainingLives--;
        incorrectGuesses.push(wordGuess);
        console.log('Incorrect Guess! You have ' + remainingLives + ' lives left.');
        console.log(hangmanStages[10 - remainingLives])

        if (remainingLives === 0) {
            console.log('Game Over! The word was: ' + chosenWord);
            console.log(hangmanStages[10]);
            displayStats();
            rl.close
        } else {
            await promptUser();
        }
    }
};

const displayStats = () => {
    console.log('\nGame Stats:');
    console.log('Total Guesses: ' + totalGuesses);
    console.log('Incorrect Guesses: ' + incorrectGuesses);
    console.log('Incorrect letters/words guessed: ' + incorrectGuesses.join(', '));
};

promptUser(); // Start the game

