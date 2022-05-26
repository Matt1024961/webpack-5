import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { SectionsTable } from '../../types/sections-table';
// import { ConstantDatabaseFilters } from '../../constants/database-filters';

import { getIsFilterActive } from './filters';

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

export const getAllsections = () => {
  return sectionsSelector.selectAll(store.getState());
};

export const allActivesectionsCount = () => {
  return sectionsSelector.selectAll(store.getState()).filter((element: any) => {
    return element.isActive;
  }).length;
};

export const sectionsCount = () => {
  return sectionsSelector.selectAll(store.getState()).length;
};

export const getsectionCount = () => {
  const allFilters = getIsFilterActive();
  return sectionsSelector.selectAll(store.getState()).filter((element: any) => {
    if (allFilters.isHighlight) {
      return element.isHighlight;
    } else {
      return element.isActive;
    }
  }).length;
};

export const getsectionPagination = (
  input: string,
  start: number,
  end: number
) => {
  const allFilters = getIsFilterActive();
  return sectionsSelector
    .selectAll(store.getState())
    .map((element: any) => {
      if (allFilters.isHighlight) {
        if (element.files.endsWith(input) && element.isHighlight) {
          return element;
        }
      }
      if (element.files.endsWith(input) && element.isActive) {
        return element;
      }
    })
    .slice(start, end + 1);
};

export const getsectionPaginationInfo = (
  start: number,
  end: number,
  amount: number
) => {
  const currentsections = getsectionCount();
  return {
    total: currentsections,
    start: start,
    end: end,
    totalPages: Math.ceil(currentsections / amount),
    currentPage: start * amount,
  };
  // console.log(input, start, end, amount);
  // const abc = sectionsSelector
  //   .selectAll(store.getState())
  //   .map((element: any) => {
  //     if (element.files.endsWith(input)) {
  //       return element;
  //     }
  //   })
  //   .slice(start, end + 1);
  // console.log(abc);

  // return {
  //   total: currentsections,
  //   start: start,
  //   end: end,
  //   totalPages: Math.ceil(currentsections / amount),
  //   currentPage: start * amount,
  // };
};
// async getsectionPaginationData(
//   _input: string,
//   start: number,
//   end: number,
//   amount: number
// ) {
//   const currentsections = this.getsectionsCount() as number;
//   return {
//     total: currentsections,
//     start: start,
//     end: end,
//     totalPages: Math.ceil(currentsections / amount),
//     currentPage: start * amount,
//   };
// }
