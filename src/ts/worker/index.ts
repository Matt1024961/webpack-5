import { StoreData } from "../store/data";
import { DataJSON } from "../types/data-json";

// import { Data } from '../data';
const fetchXhtml = async (url: string) => {
  fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
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
    .then((data: DataJSON) => {
      const storeData: StoreData = StoreData.getInstance();
      storeData.documentInfo = data.documentInfo;
      storeData.edgarRendererReports = data["ixv:edgarRendererReports"];
      storeData.entity = data["ixv:entity"];
      storeData.filterAxis = data["ixv:filterAxis"];
      storeData.filterBalance = data["ixv:filterBalance"];
      storeData.filterMembers = data["ixv:filterMembers"];
      storeData.filterPeriods = data["ixv:filterPeriods"];
      storeData.filterScale = data["ixv:filterScale"];
      storeData.filterUnits = data["ixv:filterUnits"];
      storeData.labels = data["ixv:labels"];
      storeData.references = data["ixv:references"];
      storeData.facts = data.facts;

      self.postMessage({
        data: { success: true },
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
