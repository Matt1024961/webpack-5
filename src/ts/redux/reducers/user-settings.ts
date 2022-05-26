import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { SettingsTable } from '../../types/settings-table';

// Define the initial state using that type
// const initialState: SettingsTable = {
//   hoverInfo: 1,
//   position: `top`,
//   active: `#FF6600`,
//   highlight: `#FFD700`,
//   selected: `#003768`,
//   hover: `rgba(255,0,0,0.3)`,
//   allFacts: 0,
// };

const settingsAdapter = createEntityAdapter<SettingsTable>({});
export const settingsSlice = createSlice({
  name: 'filters',
  initialState: settingsAdapter.getInitialState(),
  reducers: {
    settingsInit: settingsAdapter.addOne,
    settingsUpdate: settingsAdapter.updateOne,
  },
});
export const { actions } = settingsSlice;
export const factsReducer = (state: RootState) => state.facts;
export default settingsSlice.reducer;

export const factsSelector = settingsAdapter.getSelectors<RootState>(
  (state) => state.settings
);
