import * as moment from 'moment';
import { DataJSON } from '../types/data-json';

export class Data {
  private data: DataJSON;
  constructor(data: DataJSON) {
    this.data = data;
  }
  init(): DataJSON {
    const periods: { [key: string]: Array<string> } = {};
    this.data['ixv:filterPeriods'].forEach((current) => {
      if (current.includes(`/`)) {
        const dates = current.split(`/`);
        const difference = Math.ceil(
          moment(dates[1]).diff(moment(dates[0]), 'months', true)
        );
        const year = moment(dates[0]).format(`YYYY`);
        // eslint-disable-next-line no-prototype-builtins
        if (!periods.hasOwnProperty(year)) {
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
        // eslint-disable-next-line no-prototype-builtins
        if (!periods.hasOwnProperty(year)) {
          periods[year] = [`As of ${moment(current).format(`MM/DD/YYYY`)}`];
        } else {
          periods[year].push(`As of ${moment(current).format(`MM/DD/YYYY`)}`);
        }
      }
    });
    // document.getElementById(`active-fact-count`).innerText = this.data.facts.length.toString();
      console.log(periods);
    return this.data;
  }
}
