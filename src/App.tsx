import { useState } from "react";
import { generateItems, generateLives, generateShells } from "./utils/gameUtils";

export type Shell = {
    type: string,
    id: string
}

type GameObj = {
    items: number,
    loadout: Shell[],
    liveShells: number,
    blankShells: number,
    usedShells: Shell[]
}

const MIN_LIVES: number = 3;
const MAX_LIVES: number = 4;
const MIN_ITEMS: number = 2;
const MAX_ITEMS: number = 3;
const MIN_SHELLS: number = 2;
const MAX_SHELLS: number = 8;
const PLAYER_ONE_NAME: string = 'Skull';
const PLAYER_TWO_NAME: string = 'Pilot';
const SHELL_LOCATIONS: string[] = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eigth'
];

const App = () => {
    const [firstPlayer, setFirstPlayer] = useState<string | null>(null);
    const [round, setRound] = useState<number>(1);
    const [lives, setLives] = useState<number>(0);
    const [gameObj, setGameObj] = useState<GameObj>({
        items: 0,
        loadout: [],
        liveShells: 0,
        blankShells: 0,
        usedShells: []
    });

    const generateFirstRound = (): void => {
        setRound(1);
        setLives(generateLives(MIN_LIVES, MAX_LIVES));
        setFirstPlayer(Math.random() > 0.5 ? PLAYER_ONE_NAME : PLAYER_TWO_NAME);

        const startLoadout: Shell[] = generateShells(MIN_SHELLS, MAX_SHELLS)
        const startItems: number = generateItems(MIN_ITEMS, MAX_ITEMS, startLoadout.length);
        const liveShells: number = startLoadout.reduce((acc, curr) => {
            return curr.type === 'live' ? acc += 1 : acc
        }, 0);
        const blankShells: number = startLoadout.length - liveShells;
        setGameObj(initialState => {
            return {
                ...initialState,
                items: startItems,
                loadout: startLoadout,
                liveShells,
                blankShells
            }
        });
    }

    const generateNextRound = (): void => {
        setRound(currentRound => currentRound += 1);

        const newLoadout: Shell[] = generateShells(MIN_SHELLS, MAX_SHELLS, gameObj.loadout.length);
        const newItems: number = generateItems(MIN_ITEMS, MAX_ITEMS, newLoadout.length, gameObj.items);
        const liveShells: number = newLoadout.reduce((acc, curr) => {
            return curr.type === 'live' ? acc += 1 : acc
        }, 0);
        const blankShells: number = newLoadout.length - liveShells;
        setGameObj(prevState => {
            return {
                ...prevState,
                items: newItems,
                loadout: newLoadout,
                usedShells: [],
                liveShells,
                blankShells
            }
        });
    }

    const removeShell = (): void => {
        if (gameObj.loadout.length === 0) {
            return;
        }
        // Remove current shell from a loudout
        setGameObj(prevState => {
            return {
                ...prevState,
                loadout: [...prevState.loadout.slice(1)],
                usedShells: [...prevState.usedShells, prevState.loadout[0]]
            }
        });
    }

    const restoreShell = (): void => {
        if (gameObj.usedShells.length === 0) {
            return;
        }
        // Put last removed shell back into loadout
        setGameObj(prevState => {
            return {
                ...prevState,
                loadout: [...prevState.usedShells.slice(-1), ...prevState.loadout],
                usedShells: [...prevState.usedShells.slice(0, -1)]
            }
        });
    }

  return (
    <></>
  )
}

export default App;
