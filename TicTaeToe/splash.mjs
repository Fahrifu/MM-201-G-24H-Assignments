import { question } from 'readline-sync';

const display = () => {
    console.clear();

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

    const terminalWidth = process.stdout.columns;
    const lines = splashContent.split('\n');

    lines.forEach(line => {
        const padding = Math.max(0, Math.floor((terminalWidth - line.length) / 2));
        console.log(' '.repeat(padding) + line);
    });

    question('\nPress Enter to continue...');
};

export { display };