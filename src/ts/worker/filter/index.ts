import Database from '../../IndexedDB/database';
import { allFilters } from '../../types/filter';

const filterDB = async (
  url: string,
  allFilters: allFilters,
  isFilterActive: boolean
): Promise<{ highlight: Array<string>; active: Array<string> }> => {
  const db: Database = new Database(url);
  return await db.getHighlight(allFilters, isFilterActive);
};

self.onmessage = async ({ data }) => {
  await Promise.all([
    filterDB(data.url, data.allFilters, data.isFilterActive),
  ]).then(async (response) => {
    self.postMessage({
      all: response[0],
    });
  });
};
