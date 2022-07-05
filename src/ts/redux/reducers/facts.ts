import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { FactsTable } from '../../types/facts-table';
import { FilingURL } from '../../types/filing-url';
import { SettingsTable } from '../../types/settings-table';
import { getIsFilterActive } from './filters';
import { getURLs } from './url';
import { getSettings } from './user-settings';

const factsAdapter = createEntityAdapter<FactsTable>({
  sortComparer: (a, b) => a.order - b.order,
});
export const factsSlice = createSlice({
  name: 'facts',
  initialState: factsAdapter.getInitialState(),
  reducers: {
    factsAddMany: factsAdapter.addMany,
    factsUpsertAll: factsAdapter.upsertMany,
  },
});
export const { actions } = factsSlice;
export const factsReducer = (state: RootState) => state.facts;
export default factsSlice.reducer;

export const factsSelector = factsAdapter.getSelectors<RootState>(
  (state) => state.facts
);

export const getAllFacts = () => {
  return factsSelector.selectAll(store.getState());
};

export const getFactByID = (id: string) => {
  return factsSelector.selectById(store.getState(), id);
};

export const setFilteredFacts = (input: {
  highlight: Array<string>;
  active: Array<string>;
  isFilterActive: boolean;
}) => {
  return getAllFacts().map(({ ...current }) => {
    const highlight = input.highlight.includes(current.id as string);
    if (highlight) {
      current.isHighlight = true;
    } else {
      current.isHighlight = false;
    }
    if (input.isFilterActive) {
      const active = input.active.includes(current.id as string);
      if (active) {
        current.isActive = true;
      } else {
        current.isActive = false;
      }
    } else {
      current.isActive = true;
    }
    return current;
  });
};

export const allActiveFactsCount = () => {
  return factsSelector.selectAll(store.getState()).filter((element: any) => {
    return element.isActive;
  }).length;
};

export const getFactCount = () => {
  const filing = (getURLs() as FilingURL).filing;
  const settings = getSettings();
  const allFilters = getIsFilterActive();
  return factsSelector.selectAll(store.getState()).filter((element: any) => {
    if ((settings as SettingsTable).allFacts) {
      if (allFilters.isHighlight) {
        return element.isHighlight;
      } else {
        return element.isActive;
      }
    } else if (element.files.endsWith(filing)) {
      if (allFilters.isHighlight) {
        return element.isHighlight;
      } else {
        return element.isActive;
      }
    }
  }).length;
};

export const getFactPagination = (start: number, end: number) => {
  const filing = (getURLs() as FilingURL).filing;
  const settings = getSettings();
  const allFilters = getIsFilterActive();
  return factsSelector
    .selectAll(store.getState())
    .map((element: any) => {
      if (allFilters.isHighlight) {
        if ((settings as SettingsTable).allFacts) {
          if (element.isHighlight) {
            return element;
          }
        } else {
          if (element.files.endsWith(filing) && element.isHighlight) {
            return element;
          }
        }
      }
      if ((settings as SettingsTable).allFacts) {
        if (element.isActive) {
          return element;
        }
      } else {
        if (element.files.endsWith(filing) && element.isActive) {
          return element;
        }
      }
    })
    .filter(Boolean)
    .slice(start, end + 1);
};

export const getFactPaginationInfo = (
  start: number,
  end: number,
  amount: number
) => {
  const currentFacts = getFactCount();
  return {
    total: currentFacts,
    start: start,
    end: end,
    totalPages: Math.ceil(currentFacts / amount),
    currentPage: start * amount,
  };
};

export const getUniquePeriods = (): Array<string> => {
  // does the user want for everything, or just this filing?
  const allFacts = getAllFacts();
  return [
    ...new Set(allFacts.map((element) => element.period).filter(Boolean)),
  ] as Array<string>;
};

export const getUniqueAxis = (): Array<string> => {
  // does the user want for everything, or just this filing?
  const allFacts = getAllFacts();
  return [
    ...new Set(
      [...new Set(allFacts.map((element) => element.axes).filter(Boolean))]
        .flat()
        .map((current) => {
          return current;
        })
        .sort()
    ),
  ] as Array<string>;
};

export const getUniqueMembers = (): Array<string> => {
  // does the user want for everything, or just this filing?
  const allFacts = getAllFacts();
  return [
    ...new Set(
      [...new Set(allFacts.map((element) => element.members).filter(Boolean))]
        .flat()
        .map((current) => {
          return current;
        })
        .sort()
    ),
  ] as Array<string>;
};

export const getUniqueScales = (): Array<number> => {
  // does the user want for everything, or just this filing?
  const allFacts = getAllFacts();
  return [
    ...new Set(allFacts.map((element) => element.scale).filter(Boolean)),
  ] as Array<number>;
};

export const getUniqueBalances = (): Array<string> => {
  // does the user want for everything, or just this filing?
  const allFacts = getAllFacts();
  return [
    ...new Set(allFacts.map((element) => element.balance).filter(Boolean)),
  ] as Array<string>;
};

export const getMultiFiling = (): Array<string> => {
  const allFacts = getAllFacts();
  return [
    ...new Set(allFacts.map((element) => element.files).filter(Boolean)),
  ] as Array<string>;
};

export const getFactByTag = (tag: string): any => {
  const allFacts = getAllFacts();
  return allFacts.filter((element: any) => element.tag === tag);
};
