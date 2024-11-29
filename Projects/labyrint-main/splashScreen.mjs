import ANSI from "./utils/ANSI.mjs";
class SplashScreen {

    constructor() {
        this.dirty = true;
        this.graphics = `
 ██▓    ▄▄▄       ▄▄▄▄ ▓██   ██▓ ██▀███   ██▓ ███▄    █ ▄▄▄█████▓ ██░ ██
▓██▒   ▒████▄    ▓█████▄▒██  ██▒▓██ ▒ ██▒▓██▒ ██ ▀█   █ ▓  ██▒ ▓▒▓██░ ██▒
▒██░   ▒██  ▀█▄  ▒██▒ ▄██▒██ ██░▓██ ░▄█ ▒▒██▒▓██  ▀█ ██▒▒ ▓██░ ▒░▒██▀▀██░
▒██░   ░██▄▄▄▄██ ▒██░█▀  ░ ▐██▓░▒██▀▀█▄  ░██░▓██▒  ▐▌██▒░ ▓██▓ ░ ░▓█ ░██
░██████▒▓█   ▓██▒░▓█  ▀█▓░ ██▒▓░░██▓ ▒██▒░██░▒██░   ▓██░  ▒██▒ ░ ░▓█▒░██▓
░ ▒░▓  ░▒▒   ▓▒█░░▒▓███▀▒ ██▒▒▒ ░ ▒▓ ░▒▓░░▓  ░ ▒░   ▒ ▒   ▒ ░░    ▒ ░░▒░▒
░ ░ ▒  ░ ▒   ▒▒ ░▒░▒   ░▓██ ░▒░   ░▒ ░ ▒░ ▒ ░░ ░░   ░ ▒░    ░     ▒ ░▒░ ░
░ ░    ░   ▒    ░    ░▒ ▒ ░░    ░░   ░  ▒ ░   ░   ░ ░   ░       ░  ░░ ░
       ░   ░    ░     ░ ░     ░ ░        ░      ░           ░   ░  ░  ░
                     ░░ ░
       `.trim().split("\n");
       
    }

    animate(onComplete) {
        let currentFrame = 0;

        const intervalID = setInterval(() => {
            this.clearScreen();
            this.drawFrame(currentFrame);
            currentFrame++;

            if (currentFrame >= this.graphics.length) {
                clearInterval(intervalID);
                this.clearScreen;
                onComplete();
            }
        }, 300);
    }

    clearScreen() {
        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    }

    drawFrame(frameIndex) {
        for (let i = 0; i <= frameIndex; i++) {
            console.log(`${ANSI.COLOR.YELLOW}${this.graphics[i]}${ANSI.COLOR_RESET}`);
        }
    }
}

export default SplashScreen;