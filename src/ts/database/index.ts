import Dexie, { IndexableType } from 'dexie';
import * as moment from 'moment';
//import { Facts } from '../components/nav/facts';
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
      // NOTE we ONLY INDEX what is necessary
      facts: `++htmlId, isHtml, isNegative, isNumberic, isText, isHidden, isActive, isHighlight, isCustom, period, axes, members, scale, balance, [htmlId+isHidden], [htmlId+isHighlight], [htmlId+isText], [htmlId+isActive], [isHighlight+isActive]`,
    });
  }

  async clearFactsTable(): Promise<void> {
    await this.table('facts').clear();
  }

  async putBulkData(input: Array<FactsTable>) {
    return await this.table('facts')
      .bulkPut(input)
      .catch(Dexie.BulkError, function (error) {
        // Explicitely catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error(error);
      });
  }

  async parseData(input: DataJSON) {
    let arrayToBulkInsert = [];
    const customTags = Object.keys(input['ixv:extensionNamespaces']);
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
      if (current['ixv:factAttributes']) {
        const factToPutIntoDB = {
          // everything located in ixv:factAttributes
          tag: current['ixv:factAttributes'][0][1],
          isHtml: current['ixv:factAttributes'][2][1] ? 1 : 0,
          period: this.updatePeriod(
            input['ixv:filterPeriods'][current['ixv:factAttributes'][3][1]]
          ),
          axes: current['ixv:factAttributes'][4][1],
          members: current['ixv:factAttributes'][5][1],
          measure: current['ixv:factAttributes'][6][1],
          scale: current['ixv:factAttributes'][7][1]
            ? parseInt(current['ixv:factAttributes'][7][1], 10)
            : null,
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
          isNumeric: current['ixv:isnumeric'] ? 1 : 0,
          isText: current['ixv:istextonly'] ? 1 : 0,
          isCustom: customTags.includes(
            current[`ixv:factAttributes`][0][1].substr(
              0,
              current[`ixv:factAttributes`][0][1].indexOf(`:`)
            )
          )
            ? 1
            : 0,
          isActive: 1,
          isHighlight: 0,
        };
        arrayToBulkInsert.push(factToPutIntoDB);
        if (arrayToBulkInsert.length === 2500) {
          await this.putBulkData(arrayToBulkInsert);
          arrayToBulkInsert = [];
        }
      } else {
        console.log(current);
      }
    }
    return await this.putBulkData(arrayToBulkInsert);
  }

  updatePeriod(input: string) {
    if (input.includes(`/`)) {
      const dates = input.split(`/`);
      const difference = Math.ceil(
        moment(dates[1]).diff(moment(dates[0]), 'months', true)
      );
      return `${difference} months ending ${moment(dates[0]).format(
        `MM/DD/YYYY`
      )}`;
    } else {
      return `As of ${moment(input).format(`MM/DD/YYYY`)}`;
    }
  }

  async getFactsCount() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    const allFilters = storeFilter.getAllFilters();
    if (allFilters.search) {
      return await this.table('facts').where(`isHighlight`).equals(1).count();
    } else {
      return await this.table('facts').where(`isActive`).equals(1).count();
    }
  }

  async getHighlight(allFilters: allFilters) {
    // we always want to reset all isHighlight and isActive to true,
    // then we programatically set to false as we filter
    await this.table(`facts`)
      .where({ isHighlight: 0, isActive: 0 })
      .modify({ isHighlight: 1, isActive: 1 });

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

      const searchFactDimensions = (
        regex: RegExp,
        dimensions: Array<string>
      ) => {
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

      await this.table(`facts`)
        .filter((fact) => {
          let highlightFact = false;

          if (!highlightFact && allFilters.searchOptions.includes(0)) {
            if (fact.tag) {
              highlightFact = searchFactName(regex, fact.tag);
            }
          }

          if (!highlightFact && allFilters.searchOptions.includes(1)) {
            highlightFact = searchFactContent(regex, fact.value);
          }

          if (!highlightFact && allFilters.searchOptions.includes(2)) {
            highlightFact = searchFactLabels(regex, fact.labels);
          }

          if (!highlightFact && allFilters.searchOptions.includes(3)) {
            // this is technically "Documentation"
            highlightFact = searchFactDefinition(regex, fact.labels);
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
        })
        .modify({ isHighlight: 1 })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // user is not searching for anything, reset all isHighlights to 0 (FALSE)
      await this.table(`facts`)
        .where({ isHighlight: 1 })
        .modify({ isHighlight: 0 })
        .catch((error) => {
          console.log(error);
        });
    }

    // second we do the fact filtering
    await this.table(`facts`)
      .where({ isHighlight: 0, isActive: 0 })
      .modify({ isHighlight: 1, isActive: 1 });

    await this.table(`facts`)
      .filter((fact) => {
        const dataRadio = (option: number, fact: FactsTable): boolean => {
          switch (option) {
            case 0: {
              // All
              return true;
            }
            case 1: {
              // Amounts Only
              return fact.isNumeric ? true : false;
            }
            case 2: {
              // Text Only
              return fact.isText ? true : false;
            }
            case 3: {
              // Calculations Only
              if (fact.calculations !== null && fact.calculations[1]) {
                return true;
              }
              return false;
              return (fact.calculations && fact.calculations[1]) === null
                ? false
                : true;
            }
            case 4: {
              // Negatives Only
              return fact.isNegative ? true : false;
            }
            case 5: {
              // Additional Items
              return fact.isHidden ? true : false;
            }
          }
          return true;
        };

        const tagsRadio = (option: number, fact: FactsTable): boolean => {
          switch (option) {
            case 0: {
              // All
              return true;
            }
            case 1: {
              // Standard Only
              return fact.isCustom ? true : false;
            }
            case 2: {
              // Custom Only
              return fact.isCustom ? false : true;
            }
          }
          return true;
        };

        const axisCheck = (
          option: Array<string>,
          fact: FactsTable
        ): boolean => {
          return !option.some((element) =>
            (fact.axes as Array<string>).includes(element)
          );
        };

        const balanceCheck = (
          option: Array<string>,
          fact: FactsTable
        ): boolean => {
          return !option.includes(fact.balance);
        };

        const membersCheck = (
          option: Array<string>,
          fact: FactsTable
        ): boolean => {
          return !option.some((element) => fact.members.includes(element));
        };

        const periodsCheck = (
          option: Array<string>,
          fact: FactsTable
        ): boolean => {
          return !option.includes(fact.period);
        };

        const scaleCheck = (
          option: Array<number>,
          fact: FactsTable
        ): boolean => {
          return !option.includes(fact.scale);
        };

        let activateFact = false;
        if (!activateFact && allFilters.data) {
          activateFact = dataRadio(allFilters.data, fact);
        }

        if (!activateFact && allFilters.tags) {
          activateFact = tagsRadio(allFilters.tags, fact);
        }

        if (!activateFact && allFilters.moreFilters.axis.length) {
          activateFact = axisCheck(allFilters.moreFilters.axis, fact);
        }

        if (!activateFact && allFilters.moreFilters.balance.length) {
          activateFact = balanceCheck(allFilters.moreFilters.balance, fact);
        }

        if (!activateFact && allFilters.moreFilters.members.length) {
          activateFact = membersCheck(allFilters.moreFilters.members, fact);
        }

        if (!activateFact && allFilters.moreFilters.periods.length) {
          activateFact = periodsCheck(allFilters.moreFilters.periods, fact);
        }

        if (!activateFact && allFilters.moreFilters.scale.length) {
          activateFact = scaleCheck(allFilters.moreFilters.scale, fact);
        }

        return activateFact;
      })
      .modify({ isActive: 0 })
      .catch((error) => {
        console.log(error);
      });
  }

  async getFactById(id: string): Promise<FactsTable> {
    return await this.table('facts')
      .get(id)
      .catch((error) => {
        console.log(error);
      });
  }

  async isFactHidden(id: string): Promise<boolean> {
    try {
      return (
        (await this.table('facts')
          .where({
            htmlId: id,
            isHidden: 1,
          })
          .count()) > 0
      );
    } catch (error) {
      console.log(error);
    }
  }

  async isFactActive(id: string): Promise<boolean> {
    try {
      return (
        (await this.table('facts')
          .where({
            htmlId: id,
            isActive: 1,
          })
          .count()) > 0
      );
    } catch (error) {
      console.log(error);
    }
  }

  async isFactHighlighted(id: string): Promise<boolean> {
    try {
      return (
        (await this.table('facts')
          .where({
            htmlId: id,
            isHighlight: 1,
          })
          .count()) > 0
      );
    } catch (error) {
      console.log(error);
    }
  }

  async isFactText(id: string): Promise<boolean> {
    try {
      return (
        (await this.table('facts')
          .where({
            htmlId: id,
            isText: 1,
          })
          .count()) > 0
      );
    } catch (error) {
      console.log(error);
    }
  }

  async isFactCustom(id: string): Promise<boolean> {
    try {
      return (
        (await this.table('facts')
          .where({
            htmlId: id,
            custom: 1,
          })
          .count()) > 0
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUniquePeriods(): Promise<IndexableType> {
    return await this.table(`facts`).orderBy(`period`).uniqueKeys();
  }

  async getAllUniqueAxes(): Promise<IndexableType> {
    return await this.table(`facts`).orderBy(`axes`).uniqueKeys();
  }

  async getAllUniqueMembers(): Promise<IndexableType> {
    return await this.table(`facts`).orderBy(`members`).uniqueKeys();
  }

  async getAllUniqueScales(): Promise<IndexableType> {
    return await this.table(`facts`).orderBy(`scale`).uniqueKeys();
  }

  async getAllUniqueBalances(): Promise<IndexableType> {
    return await this.table(`facts`).orderBy(`balance`).uniqueKeys();
  }
}
// todo this goes elsewhere...obviously
interface FactsTable {
  htmlId?: string;
  tag?: string;
  period?: string;
  axes?: unknown;
  members?: Array<string> | string;
  measure?: unknown;
  scale?: number;
  decimals?: unknown;
  balance?: string;
  value?: string;
  dimensions?: unknown;
  contextref?: unknown;
  isHidden?: unknown;
  isHtml?: number;
  isNegative?: number;
  isNumeric?: number;
  isText?: number;
  isCustom?: number;
  standardLabel?: unknown;
  labels?: unknown;
  calculations?: unknown;
  isActive: number;
  isHighlight: number;
}
