import { print, clearScreen, printCentered } from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";

const UI = ` ######                                    #####                         
 #     #   ##   ##### ##### #      ###### #     # #    # # #####   ####  
 #     #  #  #    #     #   #      #      #       #    # # #    # #      
 ######  #    #   #     #   #      #####   #####  ###### # #    #  ####  
 #     # ######   #     #   #      #            # #    # # #####       # 
 #     # #    #   #     #   #      #      #     # #    # # #      #    # 
 ######  #    #   #     #   ###### ######  #####  #    # # #       ####  
                                                                         `;
let isDrawn = false;
let countdown = 2500;

const SplashScreen = {

    next: null,
    transitionTo: null,

    update: function (dt) {
        countdown -= dt;
        if (countdown <= 0) {
            this.transitionTo = this.next;
        }
    },

    draw: function (dt) {
        if (isDrawn == false) {
            isDrawn = true;
            clearScreen();
            printCentered(UI);
        }
    }

}

export default SplashScreen;