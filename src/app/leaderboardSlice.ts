import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type RequestStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

interface Player {
    username: string,
    wins: number,
    loses: number,
    winRate: string,
    multiplayerPts: number
}

interface LeaderboardState {
    playerData: Player[],
    requestStatus: RequestStatus,
    errorMessage: string | null
}

const initialState: LeaderboardState = {
    playerData: [],
    requestStatus: 'idle',
    errorMessage: null
}

export const fetchPlayerData = createAsyncThunk<Player[], string | undefined, { rejectValue: string | null }>(
    'leaderboard/fetchPlayerData',
    async (_ = '', { rejectWithValue }) => {
        const sheetId = '1L0RK2EZM-F2cwKtn5MIOknuWHDABKbvKpelFj9a3oQs';
        const sheetName = 'Scores';
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?=out&sheet=${sheetName}`;

        const res = await fetch(sheetUrl);
        const data = await res.text();
        const jsonData = JSON.parse(data.substring(47).slice(0, -2));

        if (jsonData.status === 'ok') {
            // @ts-ignore
            return jsonData.table.rows.map(row => ({
                username: row.c[0].v,
                wins: row.c[1].v,
                loses:row.c[2].v,
                winRate: row.c[3].f,
                multiplayerPts: row.c[4].v
            }))
                // @ts-ignore
                .sort((a, b) => Number(b.multiplayerPts) - Number(a.multiplayerPts));
        } else {
            return rejectWithValue(`Unable to fetch player data`);
        }
    }
);

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayerData.pending, (state) => {
                state.requestStatus = 'pending';
            })
            .addCase(fetchPlayerData.fulfilled, (state, action: PayloadAction<Player[]>) => {
                state.requestStatus = 'succeeded';
                state.errorMessage = null;
                state.playerData = action.payload;
            })
            .addCase(fetchPlayerData.rejected, (state, action) => {
                state.requestStatus = 'failed';
                state.errorMessage = action.payload ?? 'Unknown error';
            })
    }
});

export default leaderboardSlice.reducer;

