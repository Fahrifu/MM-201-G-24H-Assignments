import { drawBoard, createGameBoard } from './board.mjs';
import { print, askQuestion } from './io.mjs';
import { loadSettings, saveSettings } from './settings.mjs';
import DICTIONARY from './language.mjs';  
import { showSplashScreen } from './splash.mjs';

const PLAYER_X = 1;
const PLAYER_O = -1;

let settings = loadSettings();
let language = settings.language || 'en';  
let gameMode = settings.gameMode || 'PvP'; 
let gameboard = createGameBoard(3);  
let currentPlayer = PLAYER_X;        

async function main() {
    showSplashScreen();
    await showMainMenu();
}

async function showMainMenu() {
    let menuActive = true;

    while (menuActive) {
        print("\n===== MAIN MENU =====")
        print("1. Start Game")
        print("1. Settings")
        print("1. Exit")

        const choice = await askQuestion("Select an option: ");
        switch (choice) {
            case "1":
                await runGame();
                break;
            case "2":
                await showSettingsMenu();
                break;
            case "3":
                print("Exiting...")
                menuActive = false;
                break;
            default:
                print("Invalid choice, Please try again.");

        }
    }
}

async function runGame() {
    showSplashScreen();
    let isPlaying = true;

    while (isPlaying) {
        print(`\nGame Mode: ${gameMode}`);
        drawBoard(gameboard);
        print(`${DICTIONARY[language].CURRENT_PLAYER} ${currentPlayer === PLAYER_X ? 'X' : 'O'}, ${DICTIONARY[language].TURN_MSG}`);

        
        const move = gameMode === 'PvC' && currentPlayer === PLAYER_O ? getAiMove() : await getPlayerMove();

        
        gameboard[move.row - 1][move.col - 1] = currentPlayer;

        
        const outcome = checkGameOutcome();
        if (outcome) {
            drawBoard(gameboard);
            handleGameOutcome(outcome);
            isPlaying = await askWantToPlayAgain();
            if (isPlaying) resetGame();
        } else {
            currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        }
    }
}


async function getPlayerMove() {
    let validMove = false;
    let row, col;

    while (!validMove) {
        const input = await askQuestion(DICTIONARY[language].ENTER_MOVE);
        [row, col] = input.split(' ').map(Number);

        if (isValidMove(row, col)) {
            validMove = true;
        } else {
            print(DICTIONARY[language].INVALID_MOVE);
        }
    }

    return { row, col };
}

function getAiMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let row = 0; row < gameboard.length; row++) {
        for (let col = 0; col < gameboard.length; col++) {
            if (gameboard[row][col] === 0) {
                gameboard[row][col] = PLAYER_O;  
                let score = minimax(gameboard, 0, false);
                gameboard[row][col] = 0;  

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: row + 1, col: col + 1 };
                }
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const outcome = checkGameOutcome();

    if (outcome === PLAYER_X) return -1;
    if (outcome === PLAYER_O) return 1;
    if (outcome === 'draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                if (board[row][col] === 0) {
                    board[row][col] = PLAYER_O;
                    let score = minimax(board, depth + 1, false);
                    board[row][col] = 0;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                if (board[row][col] === 0) {
                    board[row][col] = PLAYER_X;
                    let score = minimax(board, depth + 1, true);
                    board[row][col] = 0;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function isValidMove(row, col) {
    return row > 0 && row <= gameboard.length &&
           col > 0 && col <= gameboard.length &&
           gameboard[row - 1][col - 1] === 0;
}

function checkGameOutcome() {
    for (let i = 0; i < gameboard.length; i++) {
        if (Math.abs(gameboard[i].reduce((a, b) => a + b, 0)) === gameboard.length) return currentPlayer;
        if (Math.abs(gameboard.map(row => row[i]).reduce((a, b) => a + b, 0)) === gameboard.length) return currentPlayer;
    }

    const diag1 = gameboard.map((row, idx) => row[idx]).reduce((a, b) => a + b, 0);
    const diag2 = gameboard.map((row, idx) => row[gameboard.length - 1 - idx]).reduce((a, b) => a + b, 0);

    if (Math.abs(diag1) === gameboard.length || Math.abs(diag2) === gameboard.length) return currentPlayer;

    if (gameboard.flat().every(cell => cell !== 0)) return 'draw';

    return null;
}


function handleGameOutcome(outcome) {
    if (outcome === 'draw') {
        print(DICTIONARY[language].DRAW_MSG);
    } else {
        print(`${DICTIONARY[language].WIN_MSG} ${outcome === PLAYER_X ? 'X' : 'O'}!`);
    }
}

async function askWantToPlayAgain() {
    const answer = await askQuestion(DICTIONARY[language].PLAY_AGAIN_QUESTION);
    return answer.toLowerCase().startsWith(DICTIONARY[language].CONFIRM);
}

function resetGame() {
    gameboard = createGameBoard(3);
    currentPlayer = PLAYER_X;
}

async function showSettingsMenu() {
    let settingsActive = true;

    while (settingsActive) {
        print("\n===== Settings Menu =====");
        print("1. Change Game Mode");
        print("2. Change Language");
        print("3. Back to Main Menu");

        const choice = await askQuestion("Select an option: ");
        switch (choice) {
            case "1":
                await changeGameMode();
                break;
            case "2":
                await changeLanguage();
                break;
            case "3":
                settingsActive = false;
                break;
            default:
                print("Invalid choice, please try again.");
        }
    }
}

async function changeGameMode() {
    print("1. Player vs Player (PvP)");
    print("2. Player vs Computer (PvC)");
    const modeChoice = await askQuestion("Choose game mode: ");
    if (modeChoice == "1") {
        gameMode = "PvP";
    } else if (modeChoice == "2") {
        gameMode = "PvC";
    } else {
        print("Invalid choice.");
        return;
    }
    settings.gameMode = gameMode;
    saveSettings(settings);
    print(`Game mode changed to ${gameMode}`);
}

async function changeLanguage() {
    print("1. English");
    print("2. Norwegian");
    const langChoice = await askQuestion("Choose a language: ");
    if (langChoice === "1") {
        language = "en";
    } else if (langChoice === "2") {
        language = "no";
    } else {
        print("Invalid choice.");
        return;
    }
    settings.language = language;
    saveSettings(settings);
    print("Language changes");
}
main();
