import Dexie from 'dexie';
//import { StoreData } from '../store/data';
import { DataJSON } from '../types/data-json';
// import { allFilters } from '../types/filter';
export class Database extends Dexie {
  facts!: Dexie.Table<FactsTable, number>;

  constructor() {
    super('SEC - IXViewer');
    this.version(1).stores({
      // NOTE we do NOT index the fact VALUE, because it can be a huge string (hence bad for indexeddb)
      // facts: `++id, tag`
      facts: `htmlId, tag, isHtml, period, axes, members, measure, scale, decimals, balance, dimensions.concept, dimensions.period, dimensions.lang, dimensions.unit, dimensions.key, dimensions.value, contextref, isHidden, standardLabel, labels, calculations, active, highlight`,
      // any other tables?
    });
  }

  async putData(input: Array<FactsTable>) {
    return await this.table('facts')
      .bulkPut(input)
      .catch((error) => {
        console.log(error);
      });
  }

  async parseData(input: DataJSON) {
    await this.table('facts').clear();
    const arrayToBulkInsert = [];
    for await (const current of input.facts) {
      const tempDimension: {
        key: Array<string | number>;
        value: Array<string | number>;
      } = {
        key: null,
        value: null,
      };
      // eslint-disable-next-line no-prototype-builtins
      if (current.hasOwnProperty(`dimensions`)) {
        const dimensions = { ...current.dimensions };
        delete dimensions.concept;
        delete dimensions.period;
        delete dimensions.unit;
        delete dimensions.language;
        const dimensionValues = Object.values(dimensions);
        if (dimensionValues.length) {
          tempDimension.value = dimensionValues;
        }
        const dimensionKeys = Object.keys(dimensions);
        if (dimensionKeys.length) {
          tempDimension.key = dimensionKeys;
        }
      }
      const factToPutIntoDB = {
        // everything located in ixv:factAttributes
        tag: current['ixv:factAttributes'][0][1],
        isHtml: current['ixv:factAttributes'][2][1] ? 1 : 0,
        period: input['ixv:filterPeriods'][current['ixv:factAttributes'][3][1]],
        axes: current['ixv:factAttributes'][4][1],
        members: current['ixv:factAttributes'][5][1],
        measure: current['ixv:factAttributes'][6][1],
        scale: current['ixv:factAttributes'][7][1],
        decimals: current['ixv:factAttributes'][8][1],
        balance: current['ixv:factAttributes'][9][1],
        // END everything located in ixv:factAttributes

        htmlId: current.id,
        value: current.value,
        dimensions: {
          concept: current.dimensions.concept,
          period: current.dimensions.period,
          lang: current.dimensions.language,
          unit: current.dimensions.unit,
          value: tempDimension.value,
          key: tempDimension.key,
        },
        contextref: current['ixv:contextref'],
        isHidden: current['ixv:hidden'] ? 1 : 0,
        standardLabel: current['ixv:standardLabel'],
        labels: input['ixv:labels'][current['ixv:factLabels']],
        calculations: current['ixv:factCalculations'][1],
        active: 1,
        highlight: 0,
      };
      arrayToBulkInsert.push(factToPutIntoDB);
    }
    await this.putData(arrayToBulkInsert);
    return;
  }

  async getFactsCount() {
    return await this.table('facts').where(`active`).equals(1).count();
  }

  async getHighlight(data: unknown, allFilters: unknown) {
    console.log(data);

    console.log(allFilters);
    console.log(`and away we go`);
  }
}
// todo this goes elsewhere...obviously
interface FactsTable {
  tag?: string;
  isHtml?: number;
  period?: unknown;
  axes?: unknown;
  members?: unknown;
  measure?: unknown;
  scale?: unknown;
  decimals?: unknown;
  balance?: unknown;
  htmlId?: string;
  value?: string;
  dimensions?: unknown;
  contextref?: unknown;
  isHidden?: unknown;
  standardLabel?: unknown;
  labels?: unknown;
  calculations?: unknown;
  active: number;
  highlight: number;
}
