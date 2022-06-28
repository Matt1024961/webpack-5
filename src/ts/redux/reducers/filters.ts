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
    filtersOptionsUpdate: filtersAdapter.updateOne,
    filtersReset: filtersAdapter.upsertOne,
    sectionsUpdate: filtersAdapter.updateOne,
    sectionsOptionsUpdate: filtersAdapter.updateOne,
    sectionsReset: filtersAdapter.upsertOne,
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

export const getAllFactFilters = () => {
  const factFilters = { ...filtersSelector.selectById(store.getState(), 1) };
  delete factFilters.sections;
  delete factFilters.sectionsOptions;
  delete factFilters.id;
  return factFilters;
};

export const getAllSectionFilters = () => {
  const sectionFilters = { ...filtersSelector.selectById(store.getState(), 1) };
  delete sectionFilters.data;
  delete sectionFilters.filingUrl;
  delete sectionFilters.moreFilters;
  delete sectionFilters.search;
  delete sectionFilters.searchOptions;
  delete sectionFilters.tags;
  delete sectionFilters.id;
  return sectionFilters;
};

export const resetAllFactFilters = () => {
  const currentFilters = getAllFactFilters();
  store.dispatch(
    actions.filtersReset({
      id: 1,
      search: currentFilters?.search ? currentFilters.search : null,
      searchOptions: currentFilters?.searchOptions
        ? currentFilters.searchOptions
        : null,
      sections: currentFilters?.sections ? currentFilters.sections : null,
      sectionsOptions: currentFilters?.sectionsOptions ? currentFilters.sectionsOptions : null,
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
      filingUrl: currentFilters?.filingUrl ? currentFilters.filingUrl : ``,
    })
  );
  return filtersSelector.selectById(store.getState(), 1);
};

export const getMoreFilters = () => {
  return filtersSelector.selectById(store.getState(), 1);
};

export const effect1 = createListenerMiddleware();
effect1.startListening({
  matcher: isAnyOf(actions.filtersUpdate, actions.filtersReset),
  effect: async () => {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    storeFilter.filterFacts();
  }
});

export const effect2 = createListenerMiddleware();
effect2.startListening({
  matcher: isAnyOf(actions.sectionsUpdate, actions.sectionsReset),
  effect: async () => {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    storeFilter.filterSections();
  }
});