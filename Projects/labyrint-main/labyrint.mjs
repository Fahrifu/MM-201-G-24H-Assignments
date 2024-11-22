import ANSI from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import { readMapFile, readRecordFile } from "./utils/fileHelpers.mjs";
import * as CONST from "./constants.mjs";


const startingLevel = CONST.START_LEVEL_ID;
const levels = loadLevelListings();
const levelHistory = [];

function loadLevelListings(source = CONST.LEVEL_LISTING_FILE) {
    let data = readRecordFile(source);
    let levels = {};
    for (const item of data) {
        let keyValue = item.split(":");
        if (keyValue.length >= 2) {
            let key = keyValue[0];
            let value = keyValue[1];
            levels[key] = value;
        }
    }
    return levels;
}

let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN,
}


let isDirty = true;

let playerPos = {
    row: null,
    col: null,
}

const EMPTY = " ";
const HERO = "H";
const LOOT = "$"

let direction = -1;

let items = [];

const THINGS = [LOOT, EMPTY];

let eventText = "";

const HP_MAX = 10;

const playerStats = {
    hp: 8,
    cash: 0
}

class Labyrinth {
    constructor() {
        this.lastDoorSymbol = null;
        this.level = [];
        this.levelID = null;
        this.loadLevel(startingLevel);
    }

    

    loadLevel(levelID, fromDoor = null) {

        if (this.levelID) {
            const currentDoor = this.level[playerPos.row][playerPos.col];
            this.level[playerPos.row][playerPos.col] = currentDoor;
            levelHistory.push({
                levelID: this.levelID,
                playerPos: { ...playerPos },
                lastDoor: currentDoor
            });
        }

        this.levelID = levelID;
        this.level = readMapFile(levels[levelID]);

        if (fromDoor) {
            const doorLocation = this.findSymbol("D");
            if (doorLocation) {
                this.level[doorLocation.row][doorLocation.col] = HERO
                playerPos.row = doorLocation.row;
                playerPos.col = doorLocation.col;
                }
            } else {
                playerPos.row = null;
                playerPos.col = null;
            }
        isDirty = true;
    }

    returnToPreviousLevel() {
        if (levelHistory.length === 0) return;

        const { levelID, playerPos: savedPos } = levelHistory.pop();

        this.levelID = levelID;
        this.level = readMapFile(levels[levelID]);

        this.level[savedPos.row][savedPos.col] = lastDoor;
        playerPos.row = savedPos.row;
        playerPos.col = savedPos.col;
        isDirty = true;
    }

    findSymbol(symbol) {
        for (let row = 0; row < this.level.length; row++) {
            for (let col = 0; col < this.level[row].length; col++) {
                if (this.level[row][col] === symbol) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    findSecondTeleport(currentRow, currentCol) {
        for (let row = 0; row < this.level.length; row++) {
            for (let col = 0; col < this.level[row].length; col++) {
                if (this.level[row][col] = "♨︎" && (row !== currentRow || currentCol)) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    update() {

        if (playerPos.row == null) {
            for (let row = 0; row < this.level.length; row++) {
                for (let col = 0; col < this.level[row].length; col++) {
                    if (this.level[row][col] == HERO) {
                        playerPos.row = row;
                        playerPos.col = col;
                        break;
                    }
                }
                if (playerPos.row != undefined) {
                    break;
                }
            }
        }

        let dRow = 0;
        let dCol = 0;

        if (KeyBoardManager.isUpPressed()) {
            dRow = -1;
        } else if (KeyBoardManager.isDownPressed()) {
            dRow = 1;
        }

        if (KeyBoardManager.isLeftPressed()) {
            dCol = -1;
        } else if (KeyBoardManager.isRightPressed()) {
            dCol = 1;
        }

        let tRow = playerPos.row + (1 * dRow);
        let tCol = playerPos.col + (1 * dCol);

        if (tRow < 0 || tCol < 0 || tRow >=this.level.length || tCol >= this.level[0].length ) return;

        const targetCell = this.level[tRow][tCol];

        if (targetCell === EMPTY || THINGS.includes(targetCell)) {
            if (targetCell == LOOT) {
                let loot = Math.round(Math.random() * 7) + 3;
                playerStats.cash += loot;
                eventText = `Player gained ${loot}$`;
            }

            // Restore the door symbol
            if (this.level[playerPos.row][playerPos.col] === HERO && this.lastDoorSymbol) {
                this.level[playerPos.row][playerPos.col] = this.lastDoorSymbol;
                this.lastDoorSymbol = null;
            } else {
                this.level[playerPos.row][playerPos.col] = EMPTY;
            }

            this.level[tRow][tCol] = HERO;
            playerPos.row = tRow;
            playerPos.col = tCol;

            // Make the draw function draw.
            isDirty = true;

        } else if (targetCell === "♨︎") {
            const otherTeleport = this.findSecondTeleport(tRow, tCol);
            if (otherTeleport) {
                this.level[playerPos.row][playerPos.col] = "♨︎";

                playerPos.row = otherTeleport.row;
                playerPos.col = otherTeleport.col;
                this.level[playerPos.row][playerPos.col] = HERO;

                eventText = "Teleported!";
                isDirty = true;
            }

        } else if (targetCell === "D" || targetCell === "d") {
            this.lastDoorSymbol = targetCell;
        if (targetCell === "D") {
            this.loadLevel("aSharpPlace", "D");
        } else if (targetCell === "d") {
            if (this.levelID === "aSharpPlace") {
                this.loadLevel("thirdRoom", "d");
            } else if (this.levelID === "thirdRoom") {
                this.returnToPreviousLevel();
                }
            }
        }
    }

    draw() {

        if (isDirty == false) {
            return;
        }
        isDirty = false;

        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);

        let rendering = "";

        rendering += renderHud();

        for (let row = 0; row < this.level.length; row++) {
            let rowRendering = "";
            for (let col = 0; col < this.level[row].length; col++) {
                let symbol = this.level[row][col];
                if (pallet[symbol] != undefined) {
                    rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
                } else {
                    rowRendering += symbol;
                }
            }
            rowRendering += "\n";
            rendering += rowRendering;
        }

        console.log(rendering);
        if (eventText != "") {
            console.log(eventText);
            eventText = "";
        }
    }
}

function renderHud() {
    let hpBar = `Life:[${ANSI.COLOR.RED + pad(playerStats.hp, "♥︎") + ANSI.COLOR_RESET}${ANSI.COLOR.LIGHT_GRAY + pad(HP_MAX - playerStats.hp, "♥︎") + ANSI.COLOR_RESET}]`
    let cash = `$:${playerStats.cash}`;
    return `${hpBar} ${cash}\n`;
}

function pad(len, text) {
    let output = "";
    for (let i = 0; i < len; i++) {
        output += text;
    }
    return output;
}


export default Labyrinth;