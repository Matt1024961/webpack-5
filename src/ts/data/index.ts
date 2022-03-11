import * as moment from 'moment';
import { DataJSON } from '../types/data-json';
import { StoreData } from '../store/data';
export class Data {
  private data: DataJSON;
  constructor(data: DataJSON) {
    this.data = data;
  }
  init(): DataJSON {
    const storeData: StoreData = StoreData.getInstance();
    console.log(this.data);
    storeData.documentInfo = this.data.documentInfo;
    storeData.facts = this.data.facts;
    storeData.edgarRendererReports = this.data['ixv:edgarRendererReports'];
    console.log(storeData.facts);

    // put all this below logic into the datastore singleton class
    const periods: { [key: string]: Array<string> } = {};
    this.data['ixv:filterPeriods'].forEach((current) => {
      if (current.includes(`/`)) {
        const dates = current.split(`/`);
        const difference = Math.ceil(
          moment(dates[1]).diff(moment(dates[0]), 'months', true)
        );
        const year = moment(dates[0]).format(`YYYY`);
        if (periods && !Object.prototype.hasOwnProperty.call(year, 'key')) {
          periods[year] = [
            `${difference} months ending ${moment(dates[0]).format(
              `MM/DD/YYYY`
            )}`,
          ];
        } else {
          periods[year].push(
            `${difference} months ending ${moment(dates[0]).format(
              `MM/DD/YYYY`
            )}`
          );
        }
      } else {
        const year = moment(current).format(`YYYY`);
        if (periods && !Object.prototype.hasOwnProperty.call(year, 'key')) {
          periods[year] = [`As of ${moment(current).format(`MM/DD/YYYY`)}`];
        } else {
          periods[year].push(`As of ${moment(current).format(`MM/DD/YYYY`)}`);
        }
      }
    });
    return this.data;
  }
}
