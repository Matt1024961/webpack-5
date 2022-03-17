// import { StoreData } from '../store/data';
import { DataJSON } from '../types/data-json';

const fetchData = (url: string) => {
  fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then((data: DataJSON) => {
      self.postMessage({
        data,
      });
    })
    .catch((error) => {
      self.postMessage({
        dataerror: error,
      });
    });
};

self.onmessage = ({ data: { data } }) => {
  fetchData(data);
};
