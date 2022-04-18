import Dexie from 'dexie';
import { StoreFilter } from '../store/filter';
//import { StoreData } from '../store/data';
import { DataJSON } from '../types/data-json';
import { allFilters } from '../types/filter';
// import { allFilters } from '../types/filter';
export class Database extends Dexie {
  facts!: Dexie.Table<FactsTable, number>;

  constructor() {
    super('SEC - IXViewer');
    this.version(1).stores({
      // NOTE we do NOT index the fact VALUE, because it can be a huge string (hence bad for indexeddb)
      // facts: `++id, tag`
      facts: `htmlId, tag, isHtml,isNegative, isNumberic, isText, period, axes, members, measure, scale, decimals, balance, dimensions.concept, dimensions.period, dimensions.lang, dimensions.unit, dimensions.key, dimensions.value, contextref, isHidden, standardLabel, labels, calculations, active, highlight`,
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
        isNegative: current['ixv:isnegativesonly'] ? 1 : 0,
        isNumberic: current['ixv:isnumeric'] ? 1 : 0,
        isText: current['ixv:istextonly'] ? 1 : 0,
        active: 1,
        highlight: 0,
      };
      arrayToBulkInsert.push(factToPutIntoDB);
    }
    await this.putData(arrayToBulkInsert);
    return;
  }

  async getFactsCount() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    const allFilters = storeFilter.getAllFilters();
    if (allFilters.search) {
      return await this.table('facts').where(`highlight`).equals(1).count();
    } else {
      return await this.table('facts').where(`active`).equals(1).count();
    }
  }

  async getHighlight(allFilters: allFilters) {
    if (allFilters.search) {
      const regex = new RegExp(
        allFilters.search,
        `m${allFilters.searchOptions.includes(10) ? '' : 'i'}`
      );

      const searchFactName = (regex: RegExp, factName: string): boolean => {
        return (regex as RegExp).test(factName);
      };

      const searchFactContent = (regex: RegExp, value: string): boolean => {
        if (!value) {
          return false;
        }
        const newValue = value
          .replace(/( |<([^>]+)>)/gi, ` `)
          .replace(/ +(?= )/g, ``);

        return (regex as RegExp).test(newValue);
      };

      const searchFactLabels = (
        regex: RegExp,
        factLabels: Array<string>
      ): boolean => {
        const factLabelsAsString = factLabels
          ?.slice(1)
          .reduce((accumulator, current) => {
            return (accumulator += ` ${current[1]}`);
          }, ``)
          .trim();
        return (regex as RegExp).test(factLabelsAsString);
      };

      const searchFactDefinition = (
        regex: RegExp,
        factLabels: Array<string>
      ): boolean => {
        if (factLabels && factLabels[0] && factLabels[0][1]) {
          const factDefinitionAsString = factLabels[0][1];
          return (regex as RegExp).test(factDefinitionAsString);
        }
      };

      const searchFactDimensions = (regex: RegExp, dimensions: Array<string>) => {
        if (dimensions) {
          const dimensionValuesAsString = dimensions.reduce(
            (accumulator, current) => {
              return (accumulator += ` ${current}`);
            },
            ``
          );
          return (regex as RegExp).test(dimensionValuesAsString as string);
        }
        return false;
      };

      const searchFactReferenceOptions = (
        regex: RegExp,
        factLabels: Array<string>,
        arrayKey: string
      ): boolean => {
        if (factLabels) {
          const factTopicsAsString = factLabels
            .reduce((accumulator, current) => {
              if (current[0] === arrayKey) {
                return (accumulator += ` ${current[1]}`);
              } else {
                return accumulator;
              }
            }, ``)
            .trim();
          return (regex as RegExp).test(factTopicsAsString as string);
        }
        return false;
      };

      await this.table(`facts`).filter((fact) => {
        let highlightFact = false;

        if (!highlightFact && allFilters.searchOptions.includes(0)) {
          if (fact.tag) {
            highlightFact = searchFactName(
              regex,
              fact.tag
            );
          }
        }

        if (!highlightFact && allFilters.searchOptions.includes(1)) {
          highlightFact = searchFactContent(regex, fact.value);
        }

        if (!highlightFact && allFilters.searchOptions.includes(2)) {
          highlightFact = searchFactLabels(
            regex,
            fact.labels
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(3)) {
          // this is technically "Documentation"
          highlightFact = searchFactDefinition(
            regex,
            fact.labels
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(4)) {
          highlightFact = searchFactDimensions(regex, fact.dimensionsValue);
        }

        if (!highlightFact && allFilters.searchOptions.includes(5)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            fact.references,
            `Topic`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(6)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            fact.references,
            `SubTopic`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(7)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            fact.references,
            `Paragraph`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(8)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            fact.references,
            `Publisher`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(9)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            fact.references,
            `Section`
          );
        }
        return highlightFact;

      }).toArray().then(async (result) => {
        result.forEach(current => {
          current.highlight = 1;
        });
        await this.table(`facts`).bulkPut(result);
      }).catch(error => {
        console.log(error);
      });
    }

  }

  async getFactById(id: string): Promise<FactsTable> {
    return await this.table('facts').get(id).catch(error => {
      console.log(error);
    });

  }
}
// todo this goes elsewhere...obviously
interface FactsTable {
  tag?: string;
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
  isHtml?: number;
  isNegative?: number;
  isNumeric?: number;
  isText?: number;
  standardLabel?: unknown;
  labels?: unknown;
  calculations?: unknown;
  active: number;
  highlight: number;
}
