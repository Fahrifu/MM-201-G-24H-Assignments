import Labyrinth from "./labyrint.mjs"
import Menu from "./menu.mjs";
import SplashScreen from "./splashScreen.mjs";
import ANSI from "./utils/ANSI.mjs";

const REFRESH_RATE = 300;

console.log(ANSI.RESET, ANSI.CLEAR_SCREEN, ANSI.HIDE_CURSOR);

let intervalID = null;
let isBlocked = false;
let state = null;

function startGame() {
    const splash = new SplashScreen();

    splash.animate(() => {
        state = new Labyrinth(() => clearInterval(intervalID));
        intervalID = setInterval(update, REFRESH_RATE)
    });
}

function exitGame() {
    console.log(ANSI.CLEAR_SCREEN);
    console.log(ANSI.COLOR.RED + "Goodbye!" + ANSI.COLOR_RESET);
    process.exit();
}

function update() {

    if (isBlocked) { return; }
    isBlocked = true;
    //#region core game loop
    state.update();
    state.draw();
    //#endregion
    isBlocked = false;
}

const menu = new Menu(startGame, exitGame);
menu.show();