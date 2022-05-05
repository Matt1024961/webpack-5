export type allFilters = {
  search: search;
  searchOptions: searchOptions;
  data: data;
  tags: tags;
  moreFilters: moreFilters;
  filingUrl: string;
};
export type search = null | string | RegExp;

export type searchOptions = Array<number> | null;

export type data = number | undefined;

export type tags = number | undefined;

export type moreFilters = {
  periods: Array<string>;
  measures: Array<number>;
  axis: Array<string>;
  members: Array<string>;
  scale: Array<number>;
  balance: Array<string>;
};
