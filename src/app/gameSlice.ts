import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shell } from '../pages/Game';

interface GameObj {
    items: number,
    loadout: Shell[],
    liveShells: number,
    blankShells: number,
    usedShells: Shell[]
}

interface GameState {
    isGameStarted: boolean,
    firstPlayer: string | null,
    round: number,
    lives: number,
    gameObj: GameObj
}

const initialState: GameState = {
    isGameStarted: false,
    firstPlayer: null,
    round: 1,
    lives: 0,
    gameObj: {
        items: 0,
        loadout: [],
        liveShells: 0,
        blankShells: 0,
        usedShells: []
    }
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameStatus: (state, action: PayloadAction<boolean>) => {
            state.isGameStarted = action.payload;
        },
        setRound: (state, action: PayloadAction<number | undefined>) => {
            if (action.payload != null) {
                state.round = action.payload;
            } else {
                state.round = state.round += 1;
            }
        },
        setFirstPlayer: (state, action: PayloadAction<string>) => {
            state.firstPlayer = action.payload;
        },
        setLives: (state, action: PayloadAction<number>) => {
            state.lives = action.payload;
        },
        setGameObj: (state, action: PayloadAction<GameObj>) => {
            state.gameObj = action.payload;
        }
    }
});

export default gameSlice.reducer;
export const {
    setGameStatus,
    setRound,
    setFirstPlayer,
    setLives,
    setGameObj
} = gameSlice.actions;
