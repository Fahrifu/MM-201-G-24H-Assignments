import { print, printCentered } from "../utils/io.mjs";

function createInBetweenScreen() {
    return {
        isDrawn: false,
        next: null,
        transitionTo: null,
        displayTime: 3000,
        text: null,
        transitionFn: null,

        init: function (text, transitionFn, displayTime = 3000) {
            this.displayTime = displayTime;
            this.text = text;
            this.transitionFn = transitionFn;
        },

        update: function (dt) {
            this.displayTime -= dt;
            const secondsRemaining = Math.ceil(this.displayTime / 1000);
            if (this.displayTime <= 0) {
                this.next = this.transitionFn();
                this.transitionTo = "next_state";
            } else {
                printCentered(`${this.text}\n${t("next_player_prompt", { player: secondsRemaining})}...`);
            }
        },

        draw: function (dr) {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                printCentered(this.text);
            }
        }
    }
}

export default createInBetweenScreen;