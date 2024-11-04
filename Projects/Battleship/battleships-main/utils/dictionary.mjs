const languageState = {
    selectedLanguage: "en",
};


const translations = {
    en: {
        start_game: "Start Game",
        exit_game: "Exit Game",
        select_board_size: "Select Board Size",
        controls: "Controls",
        game_over: "Game Over",
        press_enter_to_continue: "Press Enter to Continue",
        error_invalid_target: "Invalid Target",
            
        board_small: "Small (8x8)",
        board_medium: "Medium (10x10)",
        board_large: "Large (12x12)",
    
        move_cursor: "Arrow keys / WASD: Move cursor",
        rotate_ship: "R: Rotate ship",
        place_ship: "Enter: Place ship",
        enter_or_escape: "Enter: Start | Esc: Exit",
    
        hit: "Hit!",
        miss: "Miss!",
        win_message: "{player} wins!",
        next_player_prompt: "{player}'s turn next",
            
        tutorial: "Welcome to Battleships!\n\n1. Use Arrow Keys or WASD to navigate.\n2. Press 'R' to rotate ships during placement.\n3. Press Enter to confirm ship placement or target selection.\n\nPress Enter to Return to Main Menu.",

    },
    no: {
        start_game: "Start Spill",
        exit_game: "Avslutt Spill",
        select_board_size: "Velg Brettstørrelse",
        controls: "Kontroller",
        game_over: "Spillet er Over",
        press_enter_to_continue: "Trykk Enter for å Fortsette",
        error_invalid_target: "Ugyldig Mål",
    
        board_small: "Liten (8x8)",
        board_medium: "Middels (10x10)",
        board_large: "Stor (12x12)",
    
        move_cursor: "Piltaster / WASD: Flytt markøren",
        rotate_ship: "R: Roter skip",
        place_ship: "Enter: Plasser skip",
        enter_or_escape: "Enter: Start | Esc: Avslutt",
    
        hit: "Treff!",
        miss: "Bom!",
        win_message: "{player} vinner!",
        next_player_prompt: "Neste spiller: {player}",
    
        tutorial: "Velkommen til Sjøslag!\n\n1. Bruk piltaster eller WASD for å navigere.\n2. Trykk 'R' for å rotere skip under plassering.\n3. Trykk Enter for å bekrefte plassering av skip eller målvalg.\n\nTrykk Enter for å gå tilbake til hovedmenyen."
    }
};

function setLanguage(language) {
    if (translations[language]) {
        languageState.selectedLanguage = language;
    }
}

function t(key, variables = {}) {
    let text = translations[languageState.selectedLanguage][key] || key;
    Object.keys(variables).forEach(variable => {
        text = text.replace(`{${variable}}`, variables[variable]);
    });
    return text;
}

export { setLanguage, t, languageState}

