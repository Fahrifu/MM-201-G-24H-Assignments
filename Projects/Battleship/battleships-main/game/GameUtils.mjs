export function isValidTarget(row, col, board) {
    return (
    row >= 0 && 
    row < GAME_BOARD_DIM && 
    col >= 0 && 
    col < GAME_BOARD_DIM && 
    board.target[row][col] === 0
    );
}

export function isGameOver(board) {
    return board.ships.every(row => row.every(cell => cell === 0 || cell === "X"));
}