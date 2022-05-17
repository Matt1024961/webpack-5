import FactsTable from '../../indexedDB/facts';
import SectionsTable from '../../indexedDB/sections';
import { DataJSON } from '../../types/data-json';

const fetchXhtml = async (url: string) => {
  return fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.text();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then((data) => {
      return { data };
    })
    .catch((error) => {
      return { error };
    });
};

const fetchData = async (url: string, xhtmlUrl: string) => {
  const factsTable: FactsTable = new FactsTable(url);
  const sectionsTable: SectionsTable = new SectionsTable(url);
  return fetch(url)
    .then(async (response) => {
      if (response.status >= 200 && response.status <= 299) {
        await sectionsTable.clearSectionsTable();
        await factsTable.clearFactsTable();
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then(async (data: DataJSON) => {
      await sectionsTable.parseSectionsData(data);
      return await factsTable.parseFactData(data, xhtmlUrl)

    })
    .catch((error) => {
      return { error };
    });
};

self.onmessage = async ({ data }) => {
  if (data.data && data.xhtml) {
    await Promise.all([
      fetchXhtml(data.xhtml),
      fetchData(data.data, data.xhtml),
    ]).then(async (allResponses) => {
      self.postMessage({
        all: allResponses,
      });
    });
  } else if (data.xhtml) {
    await Promise.all([fetchXhtml(data.xhtml)]).then(async (allResponses) => {
      self.postMessage({
        all: allResponses,
      });
    });
  }
};
