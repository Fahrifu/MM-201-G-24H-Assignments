import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import KeyBoardManager from "../utils/io.mjs";


const creteBattleshipScreen = (firstPlayerMap, secondPlayerMap, vsComputer = false) => {

    let currentPlayer = FIRST_PLAYER;
    let currentPlayerBoard = firstPlayerMap;
    let opponentPlayerBoard = secondPlayerMap;
    let cursorRow = 0;
    let cursorCol = 0;
    let isDrawn = false;

    function swapPlayers() {
        currentPlayer *= -1;
        [currentPlayerBoard, opponentPlayerBoard] = [opponentPlayerBoard, currentPlayerBoard]
    }

    function makeComputerMove() {
        let row, col;
        do {
            row = Math.floor(Math.random() * GAME_BOARD_DIM);
            col = Math.floor(Math.random() * GAME_BOARD_DIM);
        } while (opponentPlayerBoard.target[row][col] !== 0);

        const targetCell = opponentPlayerBoard.ships[row][col];
        opponentPlayerBoard.target[row][col] = targetCell ? "X" : "O";

        if (!isGameOver()) swapPlayers();
    }

    function isGameOver() {
        return opponentPlayerBoard.ships.every(row => row.every(cell => cell === 0 || cell === "X"));
    }
    
    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        init: function (p1Board, p2Board) {
            firstPlayerMap = p1Board;
            secondPlayerMap = p2Board;
            currentPlayerBoard = firstPlayerMap
            opponentPlayerBoard = secondPlayerMap
        },

        update: function (dt) {
            if (vsComputer && currentPlayer === SECOND_PLAYER) {
                makeComputerMove();
                return;
            }

            if (KeyBoardManager.isUpPressed()) {
                cursorRow = Math.max(0, cursorRow - 1);
                isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                cursorRow = Math.min(GAME_BOARD_DIM - 1, cursorRow + 1);
                isDrawn = false;
            }
            if (KeyBoardManager.isLeftPressed()) {
                cursorCol = Math.max(0, cursorCol - 1);
                isDrawn = false;
            }
            if (KeyBoardManager.isRightPressed()) {
                cursorCol = Math.min(GAME_BOARD_DIM - 1, cursorCol + 1);
                isDrawn = false;
            }

            if (KeyBoardManager.isEnterPressed()) {
                const targetCell = opponentPlayerBoard.ships[cursorRow][cursorCol];
                
                if (targetCell === 0) {
                    opponentPlayerBoard.target[cursorRow][cursorCol] = "O";  
                } else if (targetCell !== "X") {
                    opponentPlayerBoard.target[cursorRow][cursorCol] = "X";  
                    opponentPlayerBoard.ships[cursorRow][cursorCol] = "X";  
                }
                
                if (isGameOver()) {
                    this.transitionTo = "Game Over";
                    this.next = null;
                } else {
                    swapPlayers();
                    isDrawn = false;
                }
            }
        },

        draw: function () {
            if (isDrawn) return;
            isDrawn = true;

            clearScreen();
            let output = `Player ${currentPlayer === FIRST_PLAYER ? "1" : "2"}'s turn\n\n`;

            if (!opponentPlayerBoard || !opponentPlayerBoard.target) {
                console.error("opponentPlayerBoard or target array is undefined", opponentPlayerBoard);
                return;
            } else {
                console.log("OpponentPlayerBoard.target contents:", opponentPlayerBoard);
            }

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n';

            for (let row = 0; row < GAME_BOARD_DIM; row++) {
                output += `${String(row + 1).padStart(2, ' ')} `;

                for (let col = 0; col < GAME_BOARD_DIM; col++) {
                    const cell = opponentPlayerBoard.target[row][col];

                    if (row === cursorRow && col === cursorCol) {
                        output += ANSI.COLOR.YELLOW + (cell || "█") + ANSI.RESET + ' ';
                    } else if (cell === "X") {
                        output += ANSI.COLOR.RED + cell + ANSI.RESET + ' ';
                    } else if (cell === "O") {
                        output += ANSI.COLOR.BLUE + cell + ANSI.RESET + ' ';
                    } else {
                        output += ANSI.SEA + ' ' + ANSI.RESET + ' ';
                    }
                }
                output += `${row + 1}\n`;
            }

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n';
            
            output += `\n${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}Controls:${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}\n`;
            output += 'Arrow keys: Move cursor\n';
            output += 'Enter: Select target\n';
            print(output);

            if (this.transitionTo === "Game Over") {
                print(`\n\n${currentPlayer === FIRST_PLAYER ? "Player 1" : "Player 2"} wins!`);
            }
        }
    }
};

export default creteBattleshipScreen;