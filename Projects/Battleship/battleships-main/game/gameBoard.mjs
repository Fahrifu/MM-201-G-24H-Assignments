import { create2DArrayWithFill } from "../utils/array.mjs"

function createGameBoard(dim) {
    const ships = Array.from({ length: dim}, () => Array(dim).fill(null));
    const target = Array.from({ length: dim}, () => Array(dim).fill(0));
    return { ships, target};
}

export default createGameBoard;