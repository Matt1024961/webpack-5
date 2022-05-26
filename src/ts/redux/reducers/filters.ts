import {
  createSlice,
  createEntityAdapter,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { StoreFilter } from '../../store/filter';
import { allFilters } from '../../types/filter';

const filtersAdapter = createEntityAdapter<allFilters>({});
export const filtersSlice = createSlice({
  name: 'filters',
  initialState: filtersAdapter.getInitialState(),
  reducers: {
    filtersInit: filtersAdapter.addOne,
    filtersUpdate: filtersAdapter.updateOne,
    filtersReset: filtersAdapter.upsertOne,
  },
});

export const { actions } = filtersSlice;

export const filtersReducer = (state: RootState) => state.filters;

export default filtersSlice.reducer;

export const filtersSelector = filtersAdapter.getSelectors<RootState>(
  (state) => state.filters
);

export const getIsFilterActive = () => {
  const allFilters = filtersSelector.selectById(store.getState(), 1);
  return {
    isActive: !(
      !allFilters?.data &&
      !allFilters?.tags &&
      !allFilters?.moreFilters.axis.length &&
      !allFilters?.moreFilters.balance.length &&
      !allFilters?.moreFilters.measures.length &&
      !allFilters?.moreFilters.members.length &&
      !allFilters?.moreFilters.periods.length &&
      !allFilters?.moreFilters.scale.length
    ),
    isHighlight: allFilters?.search ? true : false,
  };
};

export const getAllFilters = () => {
  return filtersSelector.selectById(store.getState(), 1);
};

export const resetAllFilters = () => {
  const currentFilters = getAllFilters();
  store.dispatch(
    actions.filtersReset({
      id: 1,
      search: currentFilters?.search ? currentFilters.search : null,
      searchOptions: currentFilters?.searchOptions
        ? currentFilters.searchOptions
        : null,
      data: undefined,
      tags: undefined,
      moreFilters: {
        periods: [],
        measures: [],
        axis: [],
        members: [],
        scale: [],
        balance: [],
      },
      filingUrl: ``,
    })
  );
  return filtersSelector.selectById(store.getState(), 1);
};
export const getMoreFilters = () => {
  return filtersSelector.selectById(store.getState(), 1);
};

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(actions.filtersUpdate, actions.filtersReset),
  effect: async () => {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    storeFilter.filterFacts();
  },
});
