import Labyrinth from "./labyrint.mjs"
import Menu from "./menu.mjs";
import SplashScreen from "./splashScreen.mjs";
import ANSI from "./utils/ANSI.mjs";

const REFRESH_RATE = 300;

console.log(ANSI.RESET, ANSI.CLEAR_SCREEN, ANSI.HIDE_CURSOR);

let intervalID = null;

function startGame() {
    const splash = new SplashScreen();

    splash.animate(() => {
        state = new Labyrinth(() => clearInterval(intervalID));
        intervalID = setInterval(update, REFRESH_RATE)
    });
}

function stopGame() {
    clearInterval(intervalID);
    console.log(ANSI.CLEAR_SCREEN, `${ANSI.COLOR.RED}Game Over!${ANSI.COLOR_RESET}`);
}

function exitGame() {
    console.log(ANSI.CLEAR_SCREEN, `${ANSI.COLOR.RED}Goodbye!${ANSI.COLOR_RESET}`);
    process.exit();
}

const menu = new Menu(startGame, exitGame);
menu.show();