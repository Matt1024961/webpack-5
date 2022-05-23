import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { SettingsTable } from '../../types/settings-table';

// Define the initial state using that type
const initialState: SettingsTable = {
  hoverInfo: 1,
  position: `top`,
  active: `#FF6600`,
  highlight: `#FFD700`,
  selected: `#003768`,
  hover: `rgba(255,0,0,0.3)`,
  allFacts: 0,
};

export const settingsSlice = createSlice({
  name: 'settings',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.hoverInfo += 1;
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.hoverInfo += action.payload;
    },
  },
});

// eslint-disable-next-line no-empty-pattern
export const { increment } = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const settingsReducer = (state: RootState) => state.settings;

export default settingsSlice.reducer;
