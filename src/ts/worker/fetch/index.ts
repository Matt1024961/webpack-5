import { Database } from '../../database';
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
  const db = new Database();
  await db.clearFactsTable();
  return fetch(url)
    .then(async (response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then(async (data: DataJSON) => {
      await db.parseData(data);
      return { data };
    })
    .catch((error) => {
      return { error };
    });
};

self.onmessage = async ({ data: { xhtml, data } }) => {
  const db = new Database();
  await db.clearFactsTable();
  await Promise.all([fetchXhtml(xhtml), fetchData(data)]).then(
    async (allResponses) => {
      await db.parseData(allResponses[1][`data`]);
      self.postMessage({
        all: allResponses,
      });
    }
  );
};
