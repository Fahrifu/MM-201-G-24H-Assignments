const languageState = {
    selectedLanguage: "en",
};


const translations = {
    en: {
        start_game: "Start Game",
        exit_game: "Exit Game",
        ship_placement: "SHIP PLACEMENT",
        player_ready: "get ready",
        player_look_away: "look away",
        controls: "Controls",
        move_cursor: "Arrow keys: Move cursor",
        rotate_ship: "R: Rotate ship",
        place_ship: "Enter: Place ship",
        ships_to_place: "Ships to place:",
        resize_prompt: "Please resize the console to at least 80x24 and restart the game.",
        language_prompt: "Select Language",

    },
    no: {
        start_game: "Start Spill",
        exit_game: "Avslutt Spill",
        ship_placement: "SKIPPLASSERING",
        player_ready: "gjør deg klar",
        player_look_away: "se bort",
        controls: "Kontroller",
        move_cursor: "Piltaster: Flytt markøren",
        rotate_ship: "R: Roter skip",
        place_ship: "Enter: Plasser skip",
        ships_to_place: "Skip å plassere:",
        resize_prompt: "Endre størrelsen på konsollen til minst 80x24 og start spillet på nytt.",
        language_prompt: "Velg språk",
    }
};

function setLanguage(language) {
    if (translations[language]) {
        languageState.selectedLanguage = language;
    }
}

function t(key) {
    return translations[languageState.selectedLanguage][key] || key;
}

export { setLanguage, t, languageState}

