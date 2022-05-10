import FactsTable from '../../indexedDB/facts';
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
  const db: FactsTable = new FactsTable(url);
  return fetch(url)
    .then(async (response) => {
      if (response.status >= 200 && response.status <= 299) {
        // await db.clearFactsTable();
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then(async (data: DataJSON) => {
      return await db.parseData(data, xhtmlUrl);
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
