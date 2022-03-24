import { search as searchType } from '../../types/filter';
export class StoreFilter {
  private _search: searchType;
  //   private _data;
  //   private _tags;
  //   private _moreFilters;
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

  public get search() {
    return this._search;
  }

  public set search(input: searchType) {
    // set up the data for success
    this._search = input;
  }
}
