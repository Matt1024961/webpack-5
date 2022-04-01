import { ErrorClass } from '../../error';
import { search as searchType } from '../../types/filter';
import { searchOptions as searchOptionType } from '../../types/filter';
import { data as dataType } from '../../types/filter';
import { tags as tagsType } from '../../types/filter';
import { more_filters as moreFiltersType } from '../../types/filter';
import { Attributes } from '../attributes';
import { StoreData } from '../data';
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

  public filterFacts() {
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
          storeData.setFilingFactsActive(event.data.filteredFacts);
          const attributes = new Attributes();
          attributes.setProperAttribute();
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
