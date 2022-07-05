import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { FilingURL } from '../../types/filing-url';

const urlAdapter = createEntityAdapter<FilingURL>({});
export const urlSlice = createSlice({
  name: 'url',
  initialState: urlAdapter.getInitialState(),
  reducers: {
    init: urlAdapter.addOne,
    upsert: urlAdapter.upsertOne,
  },
});
export const { actions } = urlSlice;
export const urlReducer = (state: RootState) => state.url;
export default urlSlice.reducer;

export const urlSelector = urlAdapter.getSelectors<RootState>(
  (state) => state.url
);

export const getURLs = () => {
  return urlSelector.selectById(store.getState(), 1);
};
