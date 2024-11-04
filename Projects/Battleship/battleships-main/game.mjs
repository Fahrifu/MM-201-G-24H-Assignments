import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInBetweenScreen from "./game/inBetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { setLanguage, t } from "./utils/dictionary.mjs";


const GAME_FPS = 1000 / 60; 
let currentState = null;    
let gameLoop = null;        
let mainMenuScene = null;

function languageSelectionMenu() {
    let menuItemCount = 0;
    return createMenu([
        {
            text: "English", id: menuItemCount++, action: function () {
                setLanguage("en");
                initializeMainMenu();
            }
        },
        {
        text: "Norsk", id: menuItemCount++, action: function () {
            setLanguage("no");
            initializeMainMenu();
            }
        }
    ]);
}

function initializeMainMenu() {
    mainMenuScene = createMenu(buildMainMenu());
    SplashScreen.next = mainMenuScene;
    currentState = SplashScreen;
    gameLoop = setInterval(update, GAME_FPS);
}



function buildMainMenu() {
    let menuItemCount = 0;
    return [
        {
            text: t("start_game"), id: menuItemCount++, action: function () {
                clearScreen();
                let inBetween = createInBetweenScreen();
                inBetween.init(`${t("SHIP_PLACEMENT")}\n${t("First_player")}\n${t("player_look_away")}`, () => {

                    let p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {


                        let inBetween = createInBetweenScreen();
                        inBetween.init(`${t("SHIP_PLACEMENT")}\n${t("First_player")}\n${t("player_look_away")}`, () => {
                            let p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                return createBattleshipScreen(player1ShipMap, player2ShipMap);
                            })
                            return p2map;
                        });
                        return inBetween;
                    });

                    return p1map;

                }, 3);
                currentState.next = inBetween;
                currentState.transitionTo = "Map layout";
            }
        },
        { text: t("Exit Game"), id: menuItemCount++, action: function () { print(ANSI.SHOW_CURSOR); clearScreen(); process.exit(); } },
    ];
}

(function initialize() {
    print(ANSI.HIDE_CURSOR);
    clearScreen();

    if (!checkResolution()) {
        console.log(t("resize_prompt"));
        process.exit(1);
    }

    currentState = languageSelectionMenu();
    gameLoop = setInterval(update, GAME_FPS); // The game is started.
})();

function update() {
    currentState.update(GAME_FPS);
    currentState.draw(GAME_FPS);
    if (currentState.transitionTo != null) {
        currentState = currentState.next;
        print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    }
}

function checkResolution() {
    const { columns, rows } = process.stdout;
    return columns >= 80 && rows >= 24; 
}
