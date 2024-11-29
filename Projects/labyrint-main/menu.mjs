import ANSI from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";


class Menu {
    constructor(onPlay, onExit) {
        this.options = ["Play", "Exit"];
        this.selectedIndex = 0;
        this.onPlay = onPlay;
        this.onExit = onExit;
    }

    draw() {
        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        console.log(ANSI.COLOR.YELLOW + "==== MAIN MENU ====" + ANSI.COLOR_RESET);

        this.options.forEach((option, index) => {
            if (index === this.selectedIndex) {
                console.log(ANSI.COLOR.GREEN + `> ${option}` + ANSI.COLOR_RESET);
            } else {
                console.log(` ${option}`);
            }
        });
    }

    handleInput() {
        if (KeyBoardManager.isUpPressed()) {
        this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        } else if (KeyBoardManager.isDownPressed()) {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        } else if (KeyBoardManager.isEnterPressed()) {
            this.executeOption();
        }
    }

    executeOption() {
        if (this.selectedIndex === 0) {
            this.onPlay();
        } else if (this.selectedIndex === 1) {
            this.onExit();
        }
    }

    show() {
        this.intervalID = setInterval(() => {
            this.draw();
            this.handleInput();
        }, 100);
    }
}

export default Menu;