import { ErrorClass } from '../../error';
import { search as searchType } from '../../types/filter';
import { searchOptions as searchOptionType } from '../../types/filter';
import { data as dataType } from '../../types/filter';
import { tags as tagsType } from '../../types/filter';
import { moreFilters as moreFiltersType } from '../../types/filter';
import { Attributes } from '../attributes';
import { StoreData } from '../data';
import { StoreLogger } from '../logger';
import { StoreUrl } from '../url';

export class StoreFilter {
  private _search: searchType;
  private _searchOptions: searchOptionType;
  private _data: dataType;
  private _tags: tagsType;
  private _moreFilters: moreFiltersType = {
    periods: [],
    measures: [],
    axis: [],
    members: [],
    scale: [],
    balance: [],
  };
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
    return {
      search: this.search,
      searchOptions: this.searchOptions,
      data: this.data,
      tags: this.tags,
      moreFilters: this.moreFilters,
    };
  }

  public resetAllFilters() {
    this._data = 0;
    this._tags = 0;
    this._moreFilters.axis = [];
    this._moreFilters.balance = [];
    this._moreFilters.measures = [];
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
      !allFilters.moreFilters.periods.length &&
      !allFilters.moreFilters.scale.length
    );
  }

  public filterFacts() {
    const start = performance.now();
    document.querySelector(`sec-facts`).setAttribute(`loading`, ``);
    if (this.isFilterActive()) {
      document
        .querySelector(`sec-reset-all-filters`)
        .classList.remove(`d-none`);
    } else {
      document.querySelector(`sec-reset-all-filters`).classList.add(`d-none`);
    }
    if (window.Worker) {
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const storeData: StoreData = StoreData.getInstance();
      const worker = new Worker(
        new URL('./../../worker/filter', import.meta.url)
      );
      worker.postMessage({
        data: storeData.getForFilter(storeUrl.filing),
        facts: storeData.getFilingFacts(storeUrl.filing),
        allFilters: this.getAllFilters(),
      });

      worker.onmessage = (event) => {
        if (event.data) {
          console.log(event.data.updatedFacts);
          storeData.setFilingFactsActive(event.data.updatedFacts.filter);
          storeData.setFilingFactsHighlight(event.data.updatedFacts.highlight);
          const attributes = new Attributes();
          attributes.setProperAttribute();
          document.querySelector(`sec-facts`).setAttribute(`update-count`, ``);
          const stop = performance.now();
          const storeLogger: StoreLogger = StoreLogger.getInstance();
          storeLogger.info(
            `Filtering Facts took ${(stop - start).toFixed(2)} milliseconds.`
          );
        }
      };
    } else {
      const error = new ErrorClass();
      error.show(`Your Browser does not have the functionality to do this.`);
    }
  }

  public get search() {
    return this._search;
  }

  public set search(input: searchType) {
    if (input) {
      console.log(input);
      input = (input as string).replace(/[\\{}()[\]^$+*?.]/g, '\\$&');
      const inputArray = input
        .replace(/ and /gi, ` & `)
        .replace(/ or /gi, ` | `)
        .split(` `);

      if (inputArray.length > 1) {
        input = inputArray.reduce((accumulator, current) => {
          if (current === `|`) {
            return `${accumulator}${current}`;
          } else if (current === `&`) {
            return accumulator;
          } else {
            return `${accumulator}(?=.*${current})`;
          }
        }, `^`);
      }
      this._search = input;
    } else {
      this._search = null;
    }
    this.filterFacts();
  }

  public get searchOptions() {
    return this._searchOptions;
  }

  public set searchOptions(input: searchOptionType) {
    this._searchOptions = input;
  }

  public get data() {
    return this._data;
  }

  public set data(input: dataType) {
    this._data = input;
    this.filterFacts();
  }

  public get tags() {
    return this._tags;
  }

  public set tags(input: tagsType) {
    this._tags = input;
    this.filterFacts();
  }

  public get moreFilters() {
    return this._moreFilters;
  }

  public set moreFilters(input: moreFiltersType) {
    this._moreFilters = input;
    this.filterFacts();
  }
}
