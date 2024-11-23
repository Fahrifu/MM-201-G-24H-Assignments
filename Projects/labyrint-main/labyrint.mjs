import ANSI from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import { readMapFile, readRecordFile } from "./utils/fileHelpers.mjs";
import * as CONST from "./constants.mjs";

const EMPTY = " ";
const HERO = "H";
const LOOT = "$";
const MYSTERY = "P";

const startingLevel = CONST.START_LEVEL_ID;
const levels = loadLevelListings();
const levelHistory = [];
const DOOR_MAPPINGS = {
    "start": { 
        "D": { targetRoom: "aSharpPlace", targetDoor: "D" } 
    },
    "aSharpPlace": { 
        "D": { targetRoom: "start", targetDoor: "D" },
        "d": { targetRoom: "thirdRoom", targetDoor: "d" } 
    },
    "thirdRoom": { 
        "d": { targetRoom: "aSharpPlace", targetDoor: "d" } 
    }
};


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

const THINGS = [LOOT, EMPTY, MYSTERY];
const PICKUPS = {
    P: {
        name: "Mystery Item",
        effect: (playerStats) => {
            const isPotion = Math.random() < 0.5;
            if (isPotion) {
                const restoredHP = 5;
                playerStats.hp = Math.min(playerStats.hp + restoredHP, HP_MAX);
                return `Picked up a Mystery Item! It was a Health Potion. Restored ${restoredHP} HP`;
            } else {
                const damage = 3;
                playerStats.hp = Math.max(playerStats - damage, 0);
                return `Picked up a Mystery Item! It was a Poison. Lost ${damage} HP`;
            }
        }
    },
    $: {
        name: "Money",
        effect: (playerStats) => {
                const amount = Math.round(Math.random() * 7) + 3;
                playerStats.cash += amount;
                eventText = `Player gained ${amount}$`;
        }
    }
};

let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.BLUE,
    "P": ANSI.COLOR.GREEN,
    "*": ANSI.COLOR.WHITE
};


let isDirty = true;

let playerPos = {
    row: null,
    col: null,
}

let eventText = "";

const HP_MAX = 20;
const playerStats = {
    hp: 20,
    strength: 4,
    cash: 0
};

class Labyrinth {
    constructor(stopGameCallBack) {
        this.stopGame = stopGameCallBack;
        this.npcs = [];
        this.projectiles = [];
        this.combatLog = [];
        this.lastDoorSymbol = null;
        this.level = [];
        this.levelID = null;
        this.loadLevel(startingLevel);
    }

    addProjectile(row, col, draw, dCol) {
        this.projectiles.push({ row, col, draw, dCol });
    }

    updateProjectiles() {
        const newProjectiles = [];

        this.projectiles.forEach((projectile) => {
            const newRow = projectile.row + projectile.dRow;
            const newCol = projectile.col + projectile.dCol;

            if (
                nextRow < 0 || nextCol < 0 ||
                nextRow >= this.level.length || nextCol >= this.level[0].length || 
                this.level[nextRow][nextCol] === "█"
            ) {
                return;
            }

            if (nextRow === playerPos.row && nextCol === playerPos.col) {
                const damage = 2;
                playerStats.hp -= damage;
                this.addCombatLog(`Projectile hits the player! Took ${damage} damage`);
                if (playerStats <= 0) {
                    this.addCombatLog("Player defeated! Game Over");
                    this.stopGame();
                }
            }

            this.level[projectile.row][projectile.col] = EMPTY;
            this.level[nextRow][nextCol] = "*"
            newProjectiles.push({ ...projectile, row: nextRow, col: nextCol});
        });
    }

    addCombatLog(message) {
        this.combatLog.push(message);
        if (this.combatLog.length > 5) {
            this.combatLog.shift();
        }
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

        this.npcs = [];
        for (let row = 0; row < this.level.length; row++) {
            for (let col = 0; col < this.level[row].length; col++) {
                if (this.level[row][col] === "X") {
                    this.npcs.push({ 
                        row, 
                        col, 
                        direction: 1,
                        strength: Math.floor(Math.random() * 5) + 1,
                        hitpoints: Math.floor(Math.random() * 10) * 5 
                    });
                }
            }
        }

     if (fromDoor) {
        const doorLocation = this.findSymbol(fromDoor);
        if (doorLocation) {
            this.level[doorLocation.row][doorLocation.col] = HERO;
            playerPos.row = doorLocation.row;
            playerPos.col = doorLocation.col;
            }
        } else if (levelID = "start") {
            const startingRow = 5;
            const startingCol = 4;
            this.level[startingRow][startingCol] = HERO;
            playerPos.row = startingRow;
            playerPos.col = startingCol;
        } else {
            playerPos.row = null;
            playerPos.col = null;
        }
        isDirty = true;
    }

    returnToPreviousLevel() {
        if (levelHistory.length === 0) return;

        const { levelID, playerPos: savedPos, lastDoor } = levelHistory.pop();

        this.levelID = levelID;
        this.level = readMapFile(levels[levelID]);

        this.level[savedPos.row][savedPos.col] = HERO;
        playerPos.row = savedPos.row;
        playerPos.col = savedPos.col;

        const currentDoor = this.lastDoorSymbol || EMPTY;
        this.level[playerPos.row][playerPos.col] = currentDoor;
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

        let tRow = playerPos.row + dRow;
        let tCol = playerPos.col + dCol;

        if (tRow < 0 || tCol < 0 || tRow >=this.level.length || tCol >= this.level[0].length ) return;

        const targetCell = this.level[tRow][tCol];

        //Pickups
        if (THINGS.includes(targetCell)) {
            if (PICKUPS[targetCell]) {
                const message = PICKUPS[targetCell].effect(playerStats);
                this.addCombatLog(message);
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

        } else if (targetCell === "X") {
            const npc = this.npcs.find(n => n.row === tRow && n.col === tCol);
            if (npc) {
                this.handleBattle(npc)
            }

        } else if (targetCell === "D" || targetCell === "d") {
        this.lastDoorSymbol = targetCell;
        const currentRoom = this.levelID;
        const doorMapping = DOOR_MAPPINGS[currentRoom][targetCell];

        if (doorMapping) {
            this.lastDoorSymbol = targetCell;
            this.loadLevel(doorMapping.targetRoom, doorMapping.targetDoor);
            isDirty = true;
            }

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
        }
        this.npcs.forEach((npc) => {
            if (npc.type === "B") {
                const heroDistance = Math.abs(npc.row - playerPos.row) + Math.abs(npc.col - playerPos.col);
                if (heroDistance <= 5) {
                    let dRow = Math.sign(playerPos.row - npc.row);
                    let dCol = Math.sign(playerPos.col - npc.col);

                    this.addProjectile(npc.row, npc.col, draw, dCol);
                }
            }
            let nextCol = npc.col + npc.direction;

            if (
                nextCol < 0 ||
                nextCol >= this.level[0].length ||
                this.level[npc.row][nextCol] !== EMPTY
            ) {
                npc.direction *= -1;
            } else {
                this.level[npc.row][npc.col] = EMPTY;
                npc.col += npc.direction;
                this.level[npc.row][npc.col] = "X";
                
            }
        });
        isDirty = true;
        this.updateProjectiles();
    }

    draw() {

        if (!isDirty) return;
        isDirty = false;

        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);

        let rendering = renderHud();
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

        rendering += "\nCombat Log:\n";
        this.combatLog.forEach(log => {
            rendering += `${log}\n`;
        });
        console.log(rendering);
    }

    handleBattle(npc) {
        
        const playerDamage = npc.strength;
        const npcDamage = playerStats.strength;

        playerStats.hp -= playerDamage;
        npc.hitpoints -= npcDamage;

        this.addCombatLog(`Battle! Player takes ${playerDamage} damage`);
        this.addCombatLog(`NPC takes ${npcDamage}`);

        if (npc.hitpoints <= 0) {
            this.addCombatLog(" NPC defeated!");
            this.level[npc.row][npc.col] = EMPTY;
            this.npcs = this.npcs.filter(n => n !== npc);
        }

        if (playerStats.hp <= 0) {
            this.addCombatLog(" Player defeated! Game Over.")
            this.stopGame();
        }
        isDirty = true;
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