import { combineReducers, configureStore } from "@reduxjs/toolkit";
import  gameSlice from "./gameSlice";
import  leaderboardSlice from "./leaderboardSlice";

const rootReducer = combineReducers({
    'game': gameSlice,
    'leaderboard': leaderboardSlice
});

export const setupStore = (preloadedState: Partial<RootState> = {}) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    });
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch'];
