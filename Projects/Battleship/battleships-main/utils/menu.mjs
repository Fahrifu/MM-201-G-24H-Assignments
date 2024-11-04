import { ANSI } from "../utils/ansi.mjs";
import KeyBoardManager, { clearScreen } from "../utils/io.mjs";
import { print, printCentered } from "../utils/io.mjs";
import { t } from "./dictionary.mjs";

let currentActiveMenuItem = 0


function createMenu(menuItems) {
    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        update: function () {
            if (KeyBoardManager.isUpPressed()) {
                currentActiveMenuItem = (currentActiveMenuItem - 1 + menuItems.length) % menuItems.length;
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                currentActiveMenuItem = (currentActiveMenuItem + 1) % menuItems.length;
                this.isDrawn = false;
            }
            if (KeyBoardManager.isEnterPressed() && menuItems[currentActiveMenuItem].action) {
                menuItems[currentActiveMenuItem].action();
            }
        },

        draw: function () {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                clearScreen();
                let output = ""

                menuItems.forEach((menuItems, index) => {
                    const title = currentActiveMenuItem === index ? `*${menuItems.text}*` : `
                    ${menuItems.text} `;
                    output += title + "\n";
                });

                printCentered(output);
            }
        }
    };
}

export default createMenu;