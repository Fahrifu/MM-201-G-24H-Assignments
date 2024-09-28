
const PLAYER_X = 1;
const PLAYER_O = -1;


const createGameBoard = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(0));  
};


const getCellDisplay = (value) => {
    if (value === PLAYER_X) return 'X';
    if (value === PLAYER_O) return 'O';
    return ' ';
};


const drawBoard = (gameboard) => {
    console.clear();
    
    const size = gameboard.length;  

    
    let header = '    ';
    for (let i = 1; i <= size; i++) {
        header += `${i}   `;
    }
    console.log(header);

    
    console.log(`  ╔${'═══╦'.repeat(size - 1)}═══╗`);


    for (let row = 0; row < size; row++) {
        let rowContent = `${row + 1} ║`;
        for (let col = 0; col < size; col++) {
            rowContent += ` ${getCellDisplay(gameboard[row][col])} ║`;
        }
        console.log(rowContent);

        
        if (row < size - 1) {
            console.log(`  ╠${'═══╬'.repeat(size - 1)}═══╣`);
        } else {
            console.log(`  ╚${'═══╩'.repeat(size - 1)}═══╝`);
        }
    }
};

export { createGameBoard, drawBoard };
