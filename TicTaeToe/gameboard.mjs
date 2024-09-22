import constants from './constants.mjs';

const drawBoard = (gameboard) => {
    console.clear();
    console.log('    1   2   3');
    console.log('  ╔═══╦═══╦═══╗');
    console.log(`1 ║ ${getCellDisplay(gameboard[0][0])} ║ ${getCellDisplay(gameboard[0][1])} ║ ${getCellDisplay(gameboard[0][2])} ║`);
    console.log('  ╠═══╬═══╬═══╣');
    console.log(`2 ║ ${getCellDisplay(gameboard[1][0])} ║ ${getCellDisplay(gameboard[1][1])} ║ ${getCellDisplay(gameboard[1][2])} ║`);
    console.log('  ╠═══╬═══╬═══╣');
    console.log(`3 ║ ${getCellDisplay(gameboard[2][0])} ║ ${getCellDisplay(gameboard[2][1])} ║ ${getCellDisplay(gameboard[2][2])} ║`);
    console.log('  ╚═══╩═══╩═══╝');
};

const getCellDisplay = (value) => {
    if (value === constants.PLAYER_X) return 'X';
    if (value === constants.PLAYER_O) return 'O';
    return ' ';
};

export { drawBoard };