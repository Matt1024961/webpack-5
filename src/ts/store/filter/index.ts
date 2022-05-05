import Database from '../../IndexedDB/facts';
import { search as searchType } from '../../types/filter';
import { searchOptions as searchOptionType } from '../../types/filter';
import { data as dataType } from '../../types/filter';
import { tags as tagsType } from '../../types/filter';
import { moreFilters as moreFiltersType } from '../../types/filter';
import { Attributes } from '../attributes';
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
  private _active: Array<string>;
  private _highlight: Array<string>;
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

  public async filterFacts() {
    const start = performance.now();
    document.querySelector(`sec-facts`).setAttribute(`loading`, ``);
    if (this.isFilterActive()) {
      document
        .querySelector(`sec-reset-all-filters`)
        .classList.remove(`d-none`);
    } else {
      document.querySelector(`sec-reset-all-filters`).classList.add(`d-none`);
    }
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    if (window.Worker) {
      const worker = new Worker(
        new URL('./../../worker/filter/index', import.meta.url),
        { name: `filter` }
      );
      worker.postMessage({
        url: storeUrl.dataURL,
        allFilters: this.getAllFilters(),
        isFilterActive: this.isFilterActive(),
      });
      worker.onmessage = async (event) => {
        if (event) {
          this.active = event.data.all.active;
          this.highlight = event.data.all.highlight;
          document.querySelector(`sec-facts`).setAttribute(`update-count`, ``);
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

  public getFactsCount() {
    if (this.highlight.length) {
      return this.highlight.length;
    } else if (this.active.length) {
      return this.active.length;
    } else {
      // we have a pretty serious error
      console.error(`DEAR MATT, investigate how this happened?`);
    }
  }

  async getFactPaginationData(
    _input: string,
    start: number,
    end: number,
    amount: number
  ) {
    const currentFacts = this.getFactsCount();
    return {
      total: currentFacts,
      start: start,
      end: end,
      totalPages: Math.ceil(currentFacts / amount),
      currentPage: start * amount,
    };
  }

  async getFactsPagination(start: number, end: number) {
    const storeUrl: StoreUrl = StoreUrl.getInstance();

    const db: Database = new Database(storeUrl.dataURL);
    if (this.search) {
      return await db.getPagination(this.highlight, start, end);
    } else {
      return await db.getPagination(this.active, start, end);
    }
  }

  public get search() {
    return this._search;
  }

  public set search(input: searchType) {
    if (input) {
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

  public get active() {
    return this._active;
  }

  public set active(input: Array<string>) {
    this._active = input;
  }

  public get highlight() {
    return this._highlight;
  }

  public set highlight(input: Array<string>) {
    this._highlight = input;
  }
}
