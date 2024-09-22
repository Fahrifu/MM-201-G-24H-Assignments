import { keyInYN, question } from 'readline-sync';
import { drawBoard } from './gameboard.mjs';
import { findBestMove } from './minimax.mjs';
import { PLAYER_X, PLAYER_O, MODE_PLAYER_VS_CPU } from './constants.mjs';
import { display } from './splash.mjs';
import { getString } from './language.mjs';
import { getGameState, resetGameboard, isValidMove } from './game.mjs';
import { displayMainMenu, displaySettingMenu, getLanguageSettings, getGameMode } from './menu.mjs';

// Busy-wait loop
const blockingDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};


let gameboard = resetGameboard();
let currentPlayer = PLAYER_X;
let isGameOver = false;

const main = () => {
    display(); // Display the splash screen

    while (true) {
        const choice = displayMainMenu();

        if (choice === '1') {
            playGame();  // Start the game
        } else if (choice === '2') {
            displaySettingMenu();  // Display settings
        } else if (choice === '3') {
            console.log('Exiting game.... Goodbye!');
            break;  // Exit the game loop
        }
    }
};

const playGame = async () => {
    gameboard = resetGameboard();
    isGameOver = false;
    currentPlayer = PLAYER_X;
    const languageSettings = getLanguageSettings();
    const gameMode = getGameMode();

    while (!isGameOver) {
        drawBoard(gameboard);  // Show the gameboard

        if (gameMode === MODE_PLAYER_VS_CPU) {
            if (currentPlayer === PLAYER_X) {
                playerMove(languageSettings);  // Player move
            } else {
                cpuMove();  // CPU move
            }
        } else {
            playerMove(languageSettings);  // Player vs. Player mode
        }

        const gameState = getGameState(gameboard);

        if (gameState.status === 'win') {
            drawBoard(gameboard);

            console.log(getString('playerWins', languageSettings).replace('${player}', currentPlayer));
            
            await blockingDelay(3000);
            isGameOver = true;
            break;  // End the game when there is a winner
        } else if (gameState.status === 'draw') {
            drawBoard(gameboard);
            console.log(getString('itsADraw', languageSettings));
            await blockingDelay(3000);
            isGameOver = true;
            break;  // End the game when there is a draw
        }

        // Switch players
        currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    }

    // Ask to play again (CPU Mode)
    const playAgain = keyInYN(getString('playAgain', languageSettings));
    if (playAgain) {
        await playAgain();
    } else {
        console.log('Returning to the main menu...')
        await blockingDelay(1000);
    }
};

const playerMove = (languageSettings) => {
    let move;
    while (true) {
        move = question(`Player ${currentPlayer}, ` + getString('enterMove', languageSettings));
        const [row, col] = move.split(' ').map(Number);

        if (isValidMove(gameboard, row - 1, col - 1)) {
            gameboard[row - 1][col - 1] = currentPlayer;
            break;
        } else {
            console.log(getString('invalidMove', languageSettings));
        }
    }
};

const cpuMove = () => {
    const bestMove = findBestMove(gameboard);
    gameboard[bestMove.row][bestMove.col] = PLAYER_O;
};

// Start the game
main();
