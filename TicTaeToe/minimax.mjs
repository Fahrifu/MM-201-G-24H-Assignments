import { PLAYER_X, PLAYER_O } from './constants.mjs';
import { checkWinner, isMovesLeft } from './game.mjs';

const evaluateBoard = (board) => {
    const winner = checkWinner(board);

    if (winner === PLAYER_O) {
        return 10;
    } else if (winner === PLAYER_X) {
        return -10;
    } else {
        return 0;
    }
};

const miniMax = (board, depth, isMaximizing) => {
    const score = evaluateBoard(board);

    if (score === 10 || score === -10) return score;

    if (!isMovesLeft(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === null) {

                    board[i][j] = PLAYER_O;

                    const value = miniMax(board, depth + 1, false);

                    board[i][j] = null;

                    best = Math.max(best, value);
                }
            }
        }
        return best;

    } else {

        let best = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === null) {


                    board[i][j] = PLAYER_X;

                    const value = miniMax(board, depth + 1, true);

                    board[i][j] = null;

                    best = Math.min(best, value);
                }
            }
        }
        return best;
    }
};

const findBestMove = (board) => {
    let bestValue = -Infinity;
    let bestMove = { row: -1, col: -1};

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {

                board[i][j] = PLAYER_O;

                const moveValue = miniMax(board, 0, false);

                board[i][j] = null;

                if (moveValue > bestValue) {
                    bestMove = { row: i, col: j };
                    bestValue = moveValue;
                }
            }
        }
    }
    return bestMove;
};

export { findBestMove };
