import { Shell } from "../pages/Game";
import generateRandomID from "./generateRandomID";

export const generateLives = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateItems = (
    min: number,
    max: number,
    loadoutLength: number,
    prevItems: number = 0
): number => {
    let items: number = 0;
    // Generate random amount of items until we get a different value than last time
    do {
        items = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (items === prevItems);

    return loadoutLength <= 6 ? items : items += 1;
}

export const generateShells = (
    min: number,
    max: number,
    prevLoadoutLength: number = 0,
    gameMode: 'vanilla' | 'multiplayer' = 'vanilla'
): Shell[] => {
    let loadoutSize: number = 0;
    // Generate random amount of shells until we get a different value than last time
    do {
        loadoutSize = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (loadoutSize === prevLoadoutLength);

    let amountLive: number = gameMode === 'vanilla'
        ? Math.max(1, Math.floor(loadoutSize / 2))
        : Math.max(1, Math.ceil(loadoutSize / 2))
    const loadout: Shell[] = [];

    // Add live and blank rounds to loadout array
    for (let i = 0; i < loadoutSize; i++ ) {
        if (i < amountLive) {
            loadout.push({
                type: 'live',
                id: generateRandomID()
            });
        } else {
            loadout.push({
                type: 'blank',
                id: generateRandomID()
            });
        }
    }

    // Shuffle loadout array to simulate inserting shells in a hidden sequence
    for (let i = loadout.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        const temp = loadout[i];

        loadout[i] = loadout[j];
        loadout[j] = temp;
    }

    return loadout;
}

export const usePhone = (loadout: Shell[], shellLocations: string[]): string => {
    if (loadout.length > 1) {
        const randomVal: number = Math.floor(Math.random() * (loadout.length - 1)) + 1;
        const revealShell: Shell = loadout[randomVal];
        const revealLocation: string = shellLocations[randomVal];
        return `${revealLocation} remaining shell... ${revealShell.type}`;
    } else {
        return 'How Unfortunate';
    } 
}
