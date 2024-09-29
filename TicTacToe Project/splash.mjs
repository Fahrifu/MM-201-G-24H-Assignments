import DICTIONARY from "./language.mjs";
import { loadSettings } from "./settings.mjs";

const settings = loadSettings();
const language = settings.language || 'en';

const splashContent = `
       ████████╗██╗ ██████╗      ████████╗ █████╗  ██████╗ 
       ╚══██╔══╝██║██╔════╝      ╚══██╔══╝██╔══██╗██╔════╝ 
          ██║   ██║██║     █████╗   ██║   ███████║██║  ███╗
          ██║   ██║██║     ╚════╝   ██║   ██╔══██║██║   ██║
          ██║   ██║╚██████╗         ██║   ██║  ██║╚██████╔╝
          ╚═╝   ╚═╝ ╚═════╝         ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 

         ${DICTIONARY[language].GAME_TITLE}
     -------------------------------------------
     ${DICTIONARY[language].GAME_DESCRIPTION} 
     -------------------------------------------
`;

export function showSplashScreen() {
    console.log(centerText(splashContent));
}


function centerText(text) {
    const terminalWidth = process.stdout.columns;
    const lines = text.split("\n");
    return lines
        .map((line) => {
            const padding = Math.floor((terminalWidth - line.length) / 2);
            return " ".repeat(padding) + line;
        })
        .join("\n");
}
