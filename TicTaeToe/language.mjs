import { LANGUAGE_ENGLISH, LANGUAGE_NORWEGIAN } from './constants.mjs';

const translations = {
    mainMenuTitle: {
        [LANGUAGE_ENGLISH]: 'Main Menu',
        [LANGUAGE_NORWEGIAN]: 'Hovedmeny'
    },
    playGame: {
        [LANGUAGE_ENGLISH]: 'Play Game',
        [LANGUAGE_NORWEGIAN]: 'Spill'
    },
    settings: {
        [LANGUAGE_ENGLISH]: 'Settings',
        [LANGUAGE_NORWEGIAN]: 'Innstillinger'
    },
    exitGame: {
        [LANGUAGE_ENGLISH]: 'Exit Game',
        [LANGUAGE_NORWEGIAN]: 'Avslutt Spill'
    },
    playAgain: {
        [LANGUAGE_ENGLISH]: 'Would you like to play again? (y/n)',
        [LANGUAGE_NORWEGIAN]: 'Vil du spille igjen? (y/n)'
    },
    enterMove: {
        [LANGUAGE_ENGLISH]: 'Enter your move (row and column, e.g., "1 3"): ',
        [LANGUAGE_NORWEGIAN]: 'Skriv inn ditt trekk (rad og kolonne, f.eks. "1 3"):'
    },
    invalidMove: {
        [LANGUAGE_ENGLISH]: 'Invalid move, please try again',
        [LANGUAGE_NORWEGIAN]: 'Ugyldig trekk, prøv igjen'
    },
    languageChanged: {
        [LANGUAGE_ENGLISH]: 'Language has been changed',
        [LANGUAGE_NORWEGIAN]: 'Språket er endret'
    },
    gameModeChanged: {
        [LANGUAGE_ENGLISH]: 'Game mode changed to:',
        [LANGUAGE_NORWEGIAN]: 'Spillmodus endret til:'
    },
    playerWins: {
        [LANGUAGE_ENGLISH]: 'Player ${player} wins!',
        [LANGUAGE_NORWEGIAN]: 'Spiller ${player} vinner!'
    },
    itsADraw: {
        [LANGUAGE_ENGLISH]: "It's a draw!",
        [LANGUAGE_NORWEGIAN]: 'Det er uavgjort!'
    },
};

const getString = (key, language) => {
    return translations[key][language] || translations[key][LANGUAGE_ENGLISH];
};

export { getString }; 

