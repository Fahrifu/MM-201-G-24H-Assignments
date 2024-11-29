import ANSI from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import { readMapFile, readRecordFile } from "./utils/fileHelpers.mjs";
import * as CONST from "./constants.mjs";

const EMPTY = " ";
const HERO = "H";
const LOOT = "$";
const MYSTERY = "P";
const HERO_ON_TELEPORTER = "@";

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
                playerStats.hp = Math.max(playerStats.hp - damage, 0);
                return `Picked up a Mystery Item! It was a Poison. Lost ${damage} HP`;
            }
        }
    },
    $: {
        name: "Money",
        effect: (playerStats) => {
                const amount = Math.round(Math.random() * 7) + 3;
                playerStats.cash += amount;
                return `Player gained ${amount}$`;
        }
    },
    "⚔️": {
        name: "Sword",
        effect: (playerStats) => {
            playerStats.weapon = WEAPONS.sword;
            return "Picked up Sword! Strength increased"
        }
    },
    "🪓": {
        name: "Axe",
        effect: (playerStats) => {
            playerStats.weapon = WEAPONS.axe;
            return "Picked up Axe! Strength increased"
        }
    }
};

const CHEAT_CODES = {
    "There can only be one": (playerStats) => {
        playerStats.hp = HP_MAX;
        return "Cheat Active: HP restored";
    },
    "Pot of gold": (playerStats) => {
        playerStats.cash += 100;
        return "Cheat Active: I'm Rich";
    }
}

const SHOP_ITEMS = {
    "Health Potion": {
        cost: 20,
        effect: (playerStats) => {
            playerStats.hp = Math.min(playerStats.hp + 10, HP_MAX);
            return "You bought a Health Potion! Restored 10 HP";
        }
    }
}

let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.BLUE,
    "P": ANSI.COLOR.GREEN,
    "*": ANSI.COLOR.WHITE
};

let cheatBuffer = "";

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
    weapon: null,
    cash: 0
};

const WEAPONS = {
    sword: {name: "Sword", bonus: 2 },
    axe: {name: "Axe", bonus: 3 }
}

class Labyrinth {
    constructor(stopGameCallBack) {
        this.stopGame = stopGameCallBack;
        this.npcs = [];
        this.projectiles = [];
        this.combatLog = [];
        this.encounterLog = [];
        this.lastDoorSymbol = null;
        this.level = [];
        this.levelID = null;
        this.teleportPairs = {};
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
        this.combatLog.push(`> ${message}`);
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

        this.teleportPairs = {};
        const teleporters = [];
        for (let row = 0; row < this.level.length; row++) {
            for (let col = 0; col < this.level[row].length; col++) {
                if (this.level[row][col] === "\u2668") {
                    teleporters.push({ row, col });
                }
            }
        }
        this.addCombatLog("Teleporters found:", teleporters);
        if (teleporters.length === 2) {
            const [t1, t2] = teleporters;
            this.addCombatLog(`Pairing teleporters: ${t1.row},${t1.col} ↔ ${t2.row},${t2.col}`);
            this.teleportPairs[`${t1.row},${t1.col}`] = t2;
            this.teleportPairs[`${t2.row},${t2.col}`] = t1;
        } else {
            console.warn(`Teleporters are not paired properly: Found ${teleporters.length}. Expected exactly 2.`)
        }

        this.npcs = [];
        for (let row = 0; row < this.level.length; row++) {
            for (let col = 0; col < this.level[row].length; col++) {
                if (this.level[row][col] === "X") {
                    this.npcs.push({ 
                        row, 
                        col, 
                        direction: 1,
                        strength: Math.floor(Math.random() * 5) + 1,
                        hitpoints: Math.floor(Math.random() * 10) + 5 
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

    handleTeleport(currentRow, currentCol) {
        const key = `${currentRow},${currentCol}`;
        const target = this.teleportPairs[key];

        if (target) {
            this.level[currentRow][currentCol] = `\u2668`;

            this.level[playerPos.row][playerPos.col] = EMPTY;

            if (this.level[playerPos.row][playerPos.col] = HERO) {
                this.level[playerPos.row][playerPos.col] = EMPTY;
            } else if (this.level[playerPos.row][playerPos.col] = HERO_ON_TELEPORTER) {
                this.level[playerPos.row][playerPos.col] = `\u2668`;
            }

            playerPos.row = target.row;
            playerPos.col = target.col;
            
            this.level[playerPos.row][playerPos.col] = HERO_ON_TELEPORTER;

            this.addCombatLog("Teleported to another location!");
            isDirty = true;
        }
    }

    update() {
        handlePlayerInput(playerStats);

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
                this.addEncounterLog(`Encountered an NPC! HP=${npc.hitpoints}, STR=${npc.strength}`);
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

        } else if (targetCell === "\u2668") {
            this.handleTeleport(tRow, tCol);
        } else if (targetCell === "S") {
            enterShop(playerStats);
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

        const { verticalPadding, horizontalPadding } = CenterOffSets(this.level);

        let rendering = renderHud();

        for (let i = 0; i < verticalPadding; i++) {
            rendering += "\n";
        }

        for (let row = 0; row < this.level.length; row++) {
            let rowRendering = " ".repeat(horizontalPadding);
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
        
        const weaponBonus = playerStats.weapon ? playerStats.weapon.bonus : 0;

        let playerDamage = playerStats.strength + weaponBonus;
        if (Math.random() < 0.2) {
            playerDamage *= 2;
            this.addCombatLog("Critical Hit! Double damage Dealt");
        }

        const defenseReduction = Math.floor(Math.random() * npc.strength);
        const netDamageToNPC = Math.max(0, playerDamage - defenseReduction);
        npc.hitpoints -= netDamageToNPC; 
        
        const npcDamage = npc.strength;
        playerStats.hp -= playerDamage;

        this.addCombatLog(`Battle! Player attacks NPC for ${netDamageToNPC} damage (${defenseReduction} blocked).`);
        this.addCombatLog(`NPC attacks player for ${npcDamage} damage`);

        this.triggerDamageEffect("player");
        if (netDamageToNPC < 0) this.triggerDamageEffect(npc);

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

    triggerDamageEffect(character) {
        if (character === "player") {
            console.log("\x1b[41m", `Player takes damage!`, "\x1b[0m");
            setTimeout(() => console.log("\x1b[0m"), 250);
        } else if (character.row != undefined && character.col != undefined) {
            this.level[character.row][character.col] = "\x1b[41mX\x1b[0m";
            setTimeout(() => {
                this.level[character.row][character.col];
                isDirty = true;
            }, 250);
        }
    }

    addEncounterLog(message) {
        this.encounterLog.push(message);
        if (this.encounterLog.length > 5) {
            this.encounterLog.shift();
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

function getTerminalSize() {
     return {
        width: process.stdout.columns,
        height: process.stdout.rows
     };
}

function CenterOffSets(level) {
    const terminalSize = getTerminalSize();
    const mapHeight = level.length;
    const mapWidth = level[0].length;

    const verticalPadding = Math.max(0, Math.floor((terminalSize.height - mapHeight) / 2));
    const horizontalPadding = Math.max(0, Math.floor((terminalSize.width - mapWidth) / 2));

    console.log(`Width=${mapWidth} Height=${mapHeight}`);
    console.log(`Vertical=${verticalPadding} Hori=${horizontalPadding}`);
    console.log(terminalSize)
    console.log(typeof mapHeight)

    return {verticalPadding, horizontalPadding};
}

function handlePlayerInput(playerStats) {
    const key = KeyBoardManager.getLastKey();

    if (key === "return") {
        if (CHEAT_CODES[cheatBuffer]) {
            const message = CHEAT_CODES[cheatBuffer](playerStats);
            addCombatLog(message);
        } else {
            addCombatLog("Invalid cheat code");
        }
        cheatBuffer = "";
    } else if (key === "backspace") {
        cheatBuffer = cheatBuffer.slice(0, -1);
    } else if (key && key.length === 1) {
        cheatBuffer += key;
    }
}

function enterShop(playerStats) {
    let inShop = true;

    while (inShop) {
        console.log("\nWelcome to the Shop!");
        console.log(`Your cash: $${playerStats.cash}`);
        console.log("Available items:");

        Object.keys(SHOP_ITEMS).forEach((item, index) => {
            console.log(`${index + 1}. ${item} - $${SHOP_ITEMS[item].cost}`)
        });
        console.log("0. Exit Shop");

        const choice = parseInt(prompt("Enter the number of the item you want to buy: "));

        if (!choice) {
            inShop = false;
            console.log("Exiting shop");
        } else {
            const item = Object.keys(SHOP_ITEMS)[choice - 1];
            continue;
        }

        const selectedItem = SHOP_ITEMS[item];
        if (playerStats.cash >= selectedItem.cost) {
            playerStats.cash -= selectedItem.cost;
            console.log(selectedItem.effect(playerStats));
        } else {
            console.log("You broke");
        }
    }
}

export default Labyrinth;