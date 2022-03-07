import { Data } from '../data';
const fetchXhtml = async (url: string) => {
  fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      self.postMessage({
        xhtml: data,
      });
    });
};

const fetchData = (url: string) => {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      const dataParse = new Data(data);
      const updatedData = dataParse.init();
      self.postMessage({
        data: updatedData,
      });
    });
};

self.onmessage = ({ data: { xhtml, data } }) => {
  fetchXhtml(xhtml);
  fetchData(data);
};
