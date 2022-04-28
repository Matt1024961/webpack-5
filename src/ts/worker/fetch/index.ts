import Database from '../../database';
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

const fetchData = async (url: string) => {
  const db: Database = new Database(url);
  return fetch(url)
    .then(async (response) => {
      if (response.status >= 200 && response.status <= 299) {
        await db.clearFactsTable();
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then(async (data: DataJSON) => {
      return await db.parseData(data);
    })
    .catch((error) => {
      return { error };
    });
};

self.onmessage = async ({ data }) => {
  await Promise.all([fetchXhtml(data.xhtml), fetchData(data.data)]).then(
    async (allResponses) => {
      self.postMessage({
        all: allResponses,
      });
    }
  );
};
