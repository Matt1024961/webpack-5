import Dexie, { IndexableType } from 'dexie';
import * as moment from 'moment';
import { ConstantDatabaseFilters } from '../constants/database-filters';
import { DataJSON } from '../types/data-json';
import { FactsTable } from '../types/facts-table';
import { allFilters } from '../types/filter';
export default class Database extends Dexie {
  facts!: Dexie.Table<FactsTable, number>;
  constructor(url: string) {
    super(`SEC - IXViewer - ${url}`);
    this.version(1).stores({
      // NOTE we ONLY INDEX what is necessary
      facts: `++htmlId, order, isHtml, isNegative, isNumeric, isText, isHidden, isActive, isHighlight, isCustom, period, axes, members, scale, balance, [htmlId+isHidden], [htmlId+isHighlight], [htmlId+isText], [htmlId+isActive], [isHighlight+isActive]`,
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
        let orderCount = 0;
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
          value: this.getTransformation(current.value, current.decimals, current['ixv:format']),
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
          order: orderCount++,
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
  getTransformation(input: string, decimals: number | null, format: string) {
    console.log(input);
    console.log(decimals);
    console.log(format);
    console.log(``)
    return input;
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

  async getFactsCount(allFilters: allFilters) {
    if (allFilters.search) {
      return await this.table('facts').where(`isHighlight`).equals(1).count();
    } else {
      return await this.table('facts').where(`isActive`).equals(1).count();
    }
  }

  async getHighlight(allFilters: allFilters, isFilterActive: boolean) {
    if (allFilters.search) {
      await this.table(`facts`)
        .where({ isHighlight: 1 })
        .modify({ isHighlight: 0 });

      const regex = new RegExp(
        allFilters.search,
        `m${allFilters.searchOptions.includes(10) ? '' : 'i'}`
      );

      await this.table(`facts`)
        .filter((fact) => {
          let highlightFact = false;

          if (!highlightFact && allFilters.searchOptions.includes(0)) {
            highlightFact = ConstantDatabaseFilters.searchFactName(
              regex,
              fact.tag
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(1)) {
            highlightFact = ConstantDatabaseFilters.searchFactContent(
              regex,
              fact.value
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(2)) {
            highlightFact = ConstantDatabaseFilters.searchFactLabels(
              regex,
              fact.labels
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(3)) {
            // this is technically "Documentation"
            highlightFact = ConstantDatabaseFilters.searchFactDefinition(
              regex,
              fact.labels
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(4)) {
            highlightFact = ConstantDatabaseFilters.searchFactDimensions(
              regex,
              fact.dimensionsValue
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(5)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Topic`
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(6)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `SubTopic`
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(7)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Paragraph`
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(8)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Publisher`
            );
          }

          if (!highlightFact && allFilters.searchOptions.includes(9)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
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
      // user is not searching for anything, reset all [isHighlights] to 0 (FALSE)
      await this.table(`facts`)
        .where({ isHighlight: 1 })
        .modify({ isHighlight: 0 })
        .catch((error) => {
          console.log(error);
        });
    }

    // second we do the fact filtering
    if (isFilterActive) {
      await this.table(`facts`).where({ isActive: 1 }).modify({ isActive: 0 });
      await this.table(`facts`)
        .filter((fact) => {
          let activateFact = true;
          if (activateFact && allFilters.data) {
            activateFact = ConstantDatabaseFilters.dataRadio(
              allFilters.data,
              fact
            );
          }

          if (activateFact && allFilters.tags) {
            activateFact = ConstantDatabaseFilters.tagsRadio(
              allFilters.tags,
              fact
            );
          }

          if (activateFact && allFilters.moreFilters.axis.length) {
            activateFact = ConstantDatabaseFilters.axisCheck(
              allFilters.moreFilters.axis,
              fact
            );
          }

          if (activateFact && allFilters.moreFilters.balance.length) {
            activateFact = ConstantDatabaseFilters.balanceCheck(
              allFilters.moreFilters.balance,
              fact
            );
          }

          if (activateFact && allFilters.moreFilters.members.length) {
            activateFact = ConstantDatabaseFilters.membersCheck(
              allFilters.moreFilters.members,
              fact
            );
          }

          if (activateFact && allFilters.moreFilters.periods.length) {
            activateFact = ConstantDatabaseFilters.periodsCheck(
              allFilters.moreFilters.periods,
              fact
            );
          }

          if (activateFact && allFilters.moreFilters.scale.length) {
            activateFact = ConstantDatabaseFilters.scaleCheck(
              allFilters.moreFilters.scale,
              fact
            );
          }

          return activateFact;
        })
        .modify({ isActive: 1 })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await this.table(`facts`)
        .where({ isActive: 0 })
        .modify({ isActive: 1 })
        .catch((error) => {
          console.log(error);
        });
    }
    return true;
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

  async getFactPaginationData(input: string, start: number, end: number, amount: number, allFilters: allFilters) {
    const currentFacts = await this.getFactsCount(allFilters);
    return {
      total: currentFacts,
      start: start,
      end: end,
      totalPages: Math.ceil(currentFacts / amount),
      currentPage: start * amount,
    };
  }

  async getFactsPagination(input: string, start: number, end: number, allFilters: allFilters) {
    if (allFilters.search) {
      return await this.facts.orderBy(`order`).and(x => x.isHighlight === 1).offset(start).limit(end + 1 - start).toArray()
    } else {
      return await this.facts.orderBy(`order`).and(x => x.isActive === 1).offset(start).limit(end + 1 - start).toArray()
    }
  }
}