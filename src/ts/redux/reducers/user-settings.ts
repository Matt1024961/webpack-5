import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { SettingsTable } from '../../types/settings-table';

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
