import { create2DArrayWithFill } from "../utils/array.mjs"

function createGameBoard(dim) {
    const ships = create2DArrayWithFill(dim, null);
    const target = create2DArrayWithFill(dim, 0);
    return { ships, target};
}

export default createGameBoard;