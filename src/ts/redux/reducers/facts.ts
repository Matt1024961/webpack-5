import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { FactsTable } from '../../types/facts-table';

// Define the initial state using that type
const initialState: FactsTable = {
  axes: null,
  balance: null,
  calculations: null,
  contextref: 'i5ed53d2f8d68466eab8f701aaf604d3a_D20210926-20211225',
  decimals: null,
  dimensions: null,
  files: 'aapl-20211225.htm',
  htmlId:
    'id3VybDovL2RvY3MudjEvZG9jOjc0OTU0NGFmMjhiOTQxMmU5NTIxYWRjYzU2ZjZlYmY3L3NlYzo3NDk1NDRhZjI4Yjk0MTJlOTUyMWFkY2M1NmY2ZWJmN180L2ZyYWc6MjQ3ZjYzYTBiNDE2NDY0NWJkYjVlNjM4OWI5N2NlNTAvdGFibGU6NTk3ZTc4MmI1YTQ0NDhkOGI2YjNhOGU0NjIyNGVmYjcvdGFibGVyYW5nZTo1OTdlNzgyYjVhNDQ0OGQ4YjZiM2E4ZTQ2MjI0ZWZiN180LTEtMS0xLTMzOTUz_cb2c1749-6653-489b-858b-1a6c99107d34',
  isCustom: 0,
  isHidden: 1,
  isHtml: 0,
  isNegative: 0,
  isNumeric: 0,
  isText: 0,
  labels: [(Array(2), Array(2), Array(2))],
  measure: null,
  members: null,
  order: 0,
  period: '3 months ending 09/26/2021',
  references: undefined,
  scale: null,
  standardLabel: 'Document Fiscal Period Focus',
  tag: 'dei:DocumentFiscalPeriodFocus',
  value: 'Q1',
};

export const factsSlice = createSlice({
  name: 'facts',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // increment: (state) => {
    //   state.order += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.hoverInfo += action.payload;
    // },
  },
});

// eslint-disable-next-line no-empty-pattern
export const {} = factsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const factsReducer = (state: RootState) => state.factsSlice;

export default factsSlice.reducer;
