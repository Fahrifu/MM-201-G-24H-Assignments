import { drawBoard, createGameBoard } from './board.mjs';
import { print, askQuestion } from './io.mjs';
import { loadSettings, saveSettings } from './settings.mjs';
import DICTIONARY from './language.mjs';  
import { showSplashScreen } from './splash.mjs';
import { ANSI } from './ansi.mjs';

const PLAYER_X = 1;
const PLAYER_O = -1;

let settings = loadSettings();
let language = settings.language || 'en';  
let gameMode = settings.gameMode || 'PvP'; 
let gameboard = createGameBoard(3);  
let currentPlayer = PLAYER_X;        

async function main() {
    clearScreen();
    showSplashScreen();
    await showMainMenu();
}

async function showMainMenu() {
    let menuActive = true;

    while (menuActive) {
        print("\n===== MAIN MENU =====")
        print("1. " + DICTIONARY[language].START_GAME);
        print("2. " + DICTIONARY[language].SETTINGS);
        print("3. " + DICTIONARY[language].EXIT);

        const choice = await askQuestion(DICTIONARY[language].SELECT_OPTION);
        switch (choice) {
            case "1":
                await runGame();
                break;
            case "2":
                await showSettingsMenu();
                break;
            case "3":
                print(DICTIONARY[language].EXITING);
                menuActive = false;
                break;
            default:
                print(DICTIONARY[language].INVALID_CHOICE);

        }
    }
}

async function runGame() {
    showSplashScreen();
    let isPlaying = true;

    while (isPlaying) {
        print(`\n${DICTIONARY[language].GAME_MODE} ${gameMode}`);
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
        print(DICTIONARY[language].SETTING_MENU_TITLE);
        print("1. " + DICTIONARY[language].CHANGE_GM);
        print("2. " + DICTIONARY[language].CHANGE_LANGUAGE);
        print("3. " + DICTIONARY[language].BACK_TO_MAIN_MENU);

        const choice = await askQuestion(DICTIONARY[language].SELECT_OPTION);
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
                print(`${DICTIONARY[language].INVALID_CHOICE}`);
        }
    }
}

async function changeGameMode() {
    print(DICTIONARY[language].GAME_MODE_MENU_TITLE);
    print("1. " + DICTIONARY[language].GAME_MODE_PVP);
    print("2. " + DICTIONARY[language].GAME_MODE_PVC);
    const modeChoice = await askQuestion(DICTIONARY[language].CHOOSE_LANGUAGE);
    if (modeChoice == "1") {
        gameMode = "PvP";
    } else if (modeChoice == "2") {
        gameMode = "PvC";
    } else {
        print(DICTIONARY[language].INVALID_CHOICE);
        return;
    }
    settings.gameMode = gameMode;
    saveSettings(settings);
    print(`${DICTIONARY[language].GAME_MODE_CHANGED} ${gameMode}`);
}

async function changeLanguage() {
    print(DICTIONARY[language].LANGUAGE_MENU_TITLE);
    print("1. " + DICTIONARY[language].ENGLISH);
    print("2. " + DICTIONARY[language].NORWEGIAN);
    const langChoice = await askQuestion(DICTIONARY[language].CHOOSE_LANGUAGE);
    if (langChoice === "1") {
        language = "en";
    } else if (langChoice === "2") {
        language = "no";
    } else {
        print(DICTIONARY[language].INVALID_CHOICE);
        return;
    }
    settings.language = language;
    saveSettings(settings);
    print(DICTIONARY[language].LANGUAGE_CHANGED);
}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}
main();
