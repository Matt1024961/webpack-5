import { Data } from '../data';
const fetchXhtml = async (url: string) => {
  fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        console.log(response);
        return response.text();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then((data) => {
      self.postMessage({
        xhtml: data,
      });
    })
    .catch((error) => {
      self.postMessage({
        xhtmlerror: error,
      });
    });
};

const fetchData = (url: string) => {
  fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then((data) => {
      const dataParse = new Data(data);
      const updatedData = dataParse.init();
      self.postMessage({
        data: updatedData,
      });
    })
    .catch((error) => {
      self.postMessage({
        dataerror: error,
      });
    });
};

self.onmessage = ({ data: { xhtml, data } }) => {
  fetchXhtml(xhtml);
  fetchData(data);
};
