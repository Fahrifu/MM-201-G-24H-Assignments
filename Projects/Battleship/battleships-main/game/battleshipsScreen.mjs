import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { isGameOver, isValidTarget } from "./GameUtils.mjs";


const createBattleshipScreen = (firstPlayerMap, secondPlayerMap, vsComputer = false) => {

    let currentPlayer = FIRST_PLAYER;
    let currentPlayerBoard = firstPlayerMap;
    let opponentPlayerBoard = secondPlayerMap;
    let cursorRow = 0;
    let cursorCol = 0;
    let isDrawn = false;
    let lastHit = null;

    function swapPlayers() {
        currentPlayer *= -1;
        [currentPlayerBoard, opponentPlayerBoard] = [opponentPlayerBoard, currentPlayerBoard]
    }

    function makeComputerMove() {
        if (isGameOver()) return;

        let row, col;
        if (lastHit) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (let [dx, dy] of directions) {
                row = lastHit.row + dx;
                col = lastHit.col + dy;
                if (isValidTarget(row, col)) break;
            }
        }

        if (!isValidTarget(row, col)) {
            do {
                row = Math.floor(Math.random() * GAME_BOARD_DIM);
                col = Math.floor(Math.random() * GAME_BOARD_DIM);
            } while (opponentPlayerBoard.target[row][col] !== 0);
        }

        const targetCell = opponentPlayerBoard.ships[row][col];
        opponentPlayerBoard.target[row][col] = targetCell ? "X" : "O";

        if (targetCell) lastHit = { row, col};
        if (!isGameOver()) swapPlayers();
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
                
                if (opponentPlayerBoard.target[cursorRow][cursorCol] === 0) {
                    opponentPlayerBoard.target[cursorRow][cursorCol] = targetCell ? "X" : "O";

                    if (targetCell) {
                        opponentPlayerBoard.ships[cursorRow][cursorCol] = "X";
                    }
                
                if (isGameOver()) {
                    this.transitionTo = t("game_over");
                    this.next = null;
                } else {
                    swapPlayers();
                    isDrawn = false;
                }
            }
        }
    },

        draw: function () {
            if (isDrawn) return;
            isDrawn = true;

            clearScreen();
            let output = `${t("next_player_prompt", { player: currentPlayer === FIRST_PLAYER ? "Player 1" : "Player 2" })}\n\n`;

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n';

            for (let row = 0; row < GAME_BOARD_DIM; row++) {
                output += `${String(row + 1).padStart(2, ' ')} `;

                for (let col = 0; col < GAME_BOARD_DIM; col++) {
                    const cell = opponentPlayerBoard.target[row][col];
                    let cellOutput = '~';

                    if (cell === "X") {
                        output += ANSI.COLOR.RED + "X" + ANSI.RESET;
                    } else if (cell === "O") {
                        output += ANSI.COLOR.BLUE + "O" + ANSI.RESET;
                    }
                    output += ` ${cellOutput} `
                }
                output += `| ${row + 1}\n`;
            }

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)} `;
            }
            output += '\n';
            
            output += `\n${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}Controls:${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}\n`;
            output += `${t("move_cursor")}\n${t("rotate_ship")}\n${t("place_ship")}\n`;
            print(output);

            if (this.transitionTo === t("game_over")) {
                print(`\n\n${t("win_message", { player: currentPlayer === FIRST_PLAYER ? "Player 1" : "Player 2" })}`);
            }
        }
    };
}

export default createBattleshipScreen;