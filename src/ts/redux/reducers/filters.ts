import {
  createSlice,
  createEntityAdapter,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { RootState } from "..";
import store from "..";
import { FilingURL } from "../../types/filing-url";
import { allFilters } from "../../types/filter";
import {
  actions as factsActions,
  getAllFacts,
  setFilteredFacts,
} from "../../redux/reducers/facts";
import { getURLs } from "./url";
import { Attributes } from "../../attributes";
import { StoreLogger } from "../../../logger";
import { actions as sectionsActions, getAllSections } from "./sections";

const filtersAdapter = createEntityAdapter<allFilters>({});
export const filtersSlice = createSlice({
  name: "filters",
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
      sectionsOptions: currentFilters?.sectionsOptions
        ? currentFilters.sectionsOptions
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
    const start = performance.now();
    document.querySelector(`sec-facts`)?.setAttribute(`loading`, ``);
    if (getIsFilterActive().isActive) {
      document
        .querySelector(`sec-reset-all-filters`)
        ?.classList.remove(`d-none`);
    } else {
      document.querySelector(`sec-reset-all-filters`)?.classList.add(`d-none`);
    }
    const dataURL = (getURLs() as FilingURL).dataURL;
    if (window.Worker) {
      const worker = new Worker(
        new URL("./../../worker/filter/index", import.meta.url),
        { name: `filter` }
      );
      worker.postMessage({
        url: dataURL,
        allFilters: getAllFactFilters(),
        isFilterActive: getIsFilterActive().isActive,
        allFacts: getAllFacts(),
      });
      worker.onmessage = async (event) => {
        if (event && event.data) {
          const facts = setFilteredFacts(event.data.facts);
          store.dispatch(factsActions.factsUpsertAll(facts));

          document.querySelector(`sec-facts`)?.setAttribute(`update-count`, ``);
          new Attributes(false);
          const stop = performance.now();
          const storeLogger: StoreLogger = StoreLogger.getInstance();
          storeLogger.info(
            `Filtering Facts took ${(stop - start).toFixed(2)} milliseconds.`
          );
        }
        worker.terminate();
      };
    } else {
      // no worker!
    }
    //}
  },
});

export const effect2 = createListenerMiddleware();
effect2.startListening({
  matcher: isAnyOf(actions.sectionsUpdate, actions.sectionsReset),
  effect: async () => {
    const start = performance.now();
    const filing = (getURLs() as FilingURL).filing;
    console.log();
    if (window.Worker) {
      const worker = new Worker(
        new URL("./../../worker/sections/index", import.meta.url),
        { name: `sections` }
      );
      worker.postMessage({
        url: filing,
        allSections: getAllSections(),
        allFilters: getAllSectionFilters(),
      });
      worker.onmessage = async (event) => {
        if (event && event.data) {
          store.dispatch(
            sectionsActions.sectionsUpsertAll(event.data.sections)
          );
          document
            .querySelector(`sec-sections-menu-single`)
            ?.setAttribute(`reset`, `true`);
          const stop = performance.now();
          const storeLogger: StoreLogger = StoreLogger.getInstance();
          storeLogger.info(
            `Filtering Sections took ${(stop - start).toFixed(2)} milliseconds.`
          );
        }
        worker.terminate();
      };
    } else {
      // no worker!
    }
  },
});
