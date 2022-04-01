import { MoreFilters } from '../components/nav/more_filters';

export type allFilters = {
  search: search;
  searchOptions: searchOptions;
  data: data;
  tags: tags;
  moreFilters: MoreFilters;
};
export type search = null | string | RegExp;

export type searchOptions = Array<number> | null;

export type data = number;

export type tags = number;

export type more_filters = {
  periods: Array<number>;
  measures: Array<number>;
  axis: Array<number>;
  members: Array<number>;
  scale: Array<number>;
  balance: Array<number>;
};
