const splashContent = `
       ████████╗██╗ ██████╗      ████████╗ █████╗  ██████╗ 
       ╚══██╔══╝██║██╔════╝      ╚══██╔══╝██╔══██╗██╔════╝ 
          ██║   ██║██║     █████╗   ██║   ███████║██║  ███╗
          ██║   ██║██║     ╚════╝   ██║   ██╔══██║██║   ██║
          ██║   ██║╚██████╗         ██║   ██║  ██║╚██████╔╝
          ╚═╝   ╚═╝ ╚═════╝         ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 

         Tic-Tac-Toe Game
     -------------------------------------------
     The ultimate battle: Player vs. CPU (Player) 
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
