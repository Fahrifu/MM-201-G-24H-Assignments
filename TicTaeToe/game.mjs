import { PLAYER_X, PLAYER_O } from './constants.mjs';

const checkWinner = (board) => {
    // Check Rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
    }
    // Check Columns
    for (let i = 0; i < 3; i++) {
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return board[0][i];
        }
    }
    // Check Diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }

    return null;
};

const checkDraw = (board) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
                return false;
            }
        }
    }
    return true;
};

const getGameState = (board) => {
    const winner = checkWinner(board);
    if (winner) {
        return { status: 'win', winner };
    }

    if (checkDraw(board)) {
        return { status: 'draw' };
    }

    return { status: 'ongoing'};
};

const resetGameboard = () => {
    return [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
};

const isValidMove = (board, row, col) => {
    return board[row][col] === null;
};

const isMovesLeft = (board) => {

    for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 3; j++) {

            if (board[i][j] === null) {

                return true;

            }

        }

    }

    return false;

}

export { checkWinner, checkDraw, getGameState, resetGameboard, isValidMove, isMovesLeft };
