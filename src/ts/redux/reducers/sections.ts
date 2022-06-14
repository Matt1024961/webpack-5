import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { SectionsTable } from '../../types/sections-table';

const sectionsAdapter = createEntityAdapter<SectionsTable>({
  sortComparer: (a, b) =>
    (a.groupType as string).localeCompare(b.groupType as string),
});
export const sectionsSlice = createSlice({
  name: 'sections',
  initialState: sectionsAdapter.getInitialState(),
  reducers: {
    sectionsAddMany: sectionsAdapter.addMany,
    sectionsUpsertAll: sectionsAdapter.upsertMany,
  },
});
export const { actions } = sectionsSlice;
export const sectionsReducer = (state: RootState) => state.sections;
export default sectionsSlice.reducer;

export const sectionsSelector = sectionsAdapter.getSelectors<RootState>(
  (state) => state.sections
);

export const getAllSections = () => {
  return sectionsSelector.selectAll(store.getState());
};

export const getAllActiveSections = () => {
  return sectionsSelector.selectAll(store.getState()).filter((element: any) => {
    return element.isActive;
  });
};