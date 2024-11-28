import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shell } from '../pages/Game';

interface GameObj {
    items: number,
    shellLoadout: Shell[],
    liveShells: number,
    blankShells: number,
    usedShells: Shell[]
}

interface GameState {
    isGameStarted: boolean,
    firstPlayer: string | null,
    currLoadout: number,
    lives: number,
    gameObj: GameObj
}

const initialState: GameState = {
    isGameStarted: false,
    firstPlayer: null,
    currLoadout: 1,
    lives: 0,
    gameObj: {
        items: 0,
        shellLoadout: [],
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
        setCurrLoadout: (state, action: PayloadAction<number | undefined>) => {
            if (action.payload != null) {
                state.currLoadout = action.payload;
            } else {
                state.currLoadout = state.currLoadout += 1;
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
    setCurrLoadout,
    setFirstPlayer,
    setLives,
    setGameObj
} = gameSlice.actions;
