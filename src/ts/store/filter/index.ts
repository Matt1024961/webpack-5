import store from '../../redux';
import { actions as factsActions, getAllFacts } from '../../redux/reducers/facts';
import { getAllFactFilters, getAllSectionFilters, getIsFilterActive } from '../../redux/reducers/filters';
import { actions as sectionsActions, getAllSections } from '../../redux/reducers/sections';
import { Attributes } from '../attributes';
import { StoreLogger } from '../logger';
import { StoreUrl } from '../url';

export class StoreFilter {
  private static instance: StoreFilter;

  private constructor() {
    //
  }

  public static getInstance(): StoreFilter {
    if (!StoreFilter.instance) {
      StoreFilter.instance = new StoreFilter();
    }
    return StoreFilter.instance;
  }

  public getAllFilters() {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    return {
      search: this.search,
      searchOptions: this.searchOptions,
      data: this.data,
      tags: this.tags,
      moreFilters: this.moreFilters,
      filingUrl: storeUrl.filing,
    };
  }

  public resetAllFilters() {
    this._data = 0;
    this._tags = 0;
    this._moreFilters.axis = [];
    this._moreFilters.balance = [];
    this._moreFilters.measures = [];
    this._moreFilters.members = [];
    this._moreFilters.periods = [];
    this._moreFilters.scale = [];
    this.filterFacts();
  }

  public isFilterActive() {
    const allFilters = this.getAllFilters();
    return !(
      !allFilters.data &&
      !allFilters.tags &&
      !allFilters.moreFilters.axis.length &&
      !allFilters.moreFilters.balance.length &&
      !allFilters.moreFilters.measures.length &&
      !allFilters.moreFilters.members.length &&
      !allFilters.moreFilters.periods.length &&
      !allFilters.moreFilters.scale.length
    );
  }

  public filterFacts() {
    const start = performance.now();
    document.querySelector(`sec-facts`)?.setAttribute(`loading`, ``);
    if (getIsFilterActive().isActive) {
      document
        .querySelector(`sec-reset-all-filters`)
        ?.classList.remove(`d-none`);
    } else {
      document.querySelector(`sec-reset-all-filters`)?.classList.add(`d-none`);
    }
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    if (window.Worker) {
      const worker = new Worker(
        new URL('./../../worker/filter/index', import.meta.url),
        { name: `filter` }
      );
      worker.postMessage({
        url: storeUrl.dataURL,
        allFilters: getAllFactFilters(),
        isFilterActive: getIsFilterActive().isActive,
        allFacts: getAllFacts(),
      });
      worker.onmessage = async (event) => {
        if (event && event.data) {
          store.dispatch(factsActions.factsUpsertAll(event.data.facts));
          document.querySelector(`sec-facts`)?.setAttribute(`update-count`, ``);
          const attributes = new Attributes();
          attributes.setProperAttribute();
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
  }

  public filterSections() {
    const start = performance.now();
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    console.log()
    if (window.Worker) {
      const worker = new Worker(
        new URL('./../../worker/sections/index', import.meta.url),
        { name: `sections` }
      );
      worker.postMessage({
        url: storeUrl.filing,
        allSections: getAllSections(),
        allFilters: getAllSectionFilters()
      });
      worker.onmessage = async (event) => {
        if (event && event.data) {
          store.dispatch(sectionsActions.sectionsUpsertAll(event.data.sections));
          document.querySelector(`sec-sections-menu-single`)?.setAttribute(`reset`, `true`);
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

  }

}
