import readlineSync from 'readline-sync'; // Ensure readline-sync is imported
import { LANGUAGE_ENGLISH, LANGUAGE_NORWEGIAN, MODE_PLAYER_VS_CPU, MODE_PLAYER_VS_PLAYER } from './constants.mjs'; // Import constants
import { getString } from './language.mjs'; // Correctly import getString from language.mjs

let languageSettings = LANGUAGE_ENGLISH;
let gameMode = MODE_PLAYER_VS_CPU;

const displayMainMenu = () => {
    console.clear();
    console.log(getString('mainMenuTitle', languageSettings));
    console.log('1. ' + getString('playGame', languageSettings));
    console.log('2. ' + getString('settings', languageSettings));
    console.log('3. ' + getString('exitGame', languageSettings));

    const choice = readlineSync.question('Choose an option: ');
    return choice;
};

const displaySettingMenu = () => {
    console.clear();
    console.log('Settings Menu\n');

    // Language selection
    console.log('1. English');
    console.log('2. Norwegian');
    const languageChoice = readlineSync.question('Choose a language: ');
    if (languageChoice === '1') {
        languageSettings = LANGUAGE_ENGLISH;
    } else if ((languageChoice) === '2') {
        languageSettings = LANGUAGE_NORWEGIAN;
    }
    console.log(getString('languageChanged', languageSettings));

    // Game mode Selection
    console.log('\n1. Player vs CPU');
    console.log('2. Player vs Player');
    const gameModeChoice = readlineSync.question('Choose game mode: ');
    if (gameModeChoice === '1') {
        gameMode = MODE_PLAYER_VS_CPU;
    } else if (gameModeChoice === '2') {
        gameMode = MODE_PLAYER_VS_PLAYER;
    }
    console.log(getString('gameModeChanged', languageSettings) + (gameMode === MODE_PLAYER_VS_CPU ? ' Player vs CPU' : ' Player vs Player'));
};

const getLanguageSettings = () => {
    return languageSettings;
};

const getGameMode = () => {
    return gameMode;
};


export { displayMainMenu, displaySettingMenu, getLanguageSettings, getGameMode };
