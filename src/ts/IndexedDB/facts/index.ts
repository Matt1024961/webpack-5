import Dexie, { IndexableType } from 'dexie';
import { ConstantDatabaseFilters } from '../../constants/database-filters';
import { PeriodConstant } from '../../constants/period';
import { TransformationsConstant } from '../../constants/transformations';
import { DataJSON } from '../../types/data-json';
import { FactsTable as FactsTableType } from '../../types/facts-table';
import { allFilters } from '../../types/filter';
import SettingsTable from '../settings';
import FilingSpecific from '../filing-specific';
//import store from '../../redux';
//import { actions } from '../../redux/reducers/facts';
export default class FactsTable extends FilingSpecific {
  async clearFactsTable(): Promise<void> {
    await this.table('facts').clear();
  }

  async putBulkData(input: Array<FactsTableType>) {
    return await this.table('facts')
      .bulkPut(input)
      .catch(Dexie.BulkError, function (error) {
        // Explicitely catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error(error);
      });
  }

  async parseFactData(input: DataJSON, xhtmlUrl: string) {
    //store.dispatch(actions.factsAddMany(input.facts));

    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    xhtmlUrl = xhtmlUrl?.split('/')?.slice(1).pop()?.split(`?`)[0] as string;
    const returnObject: { highlight: Array<string>; active: Array<string> } = {
      highlight: [],
      active: [],
    };
    let arrayToBulkInsert = [];
    const customTags = Object.keys(input['ixv:extensionNamespaces']);
    for await (const current of input.facts) {
      const tempDimension: {
        key?: Array<string | number>;
        value?: Array<string | number>;
      } = {};
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
        const factToPutIntoDB: FactsTableType = {
          // everything located in ixv:factAttributes
          tag: current['ixv:factAttributes'][0][1],
          isHtml: current['ixv:factAttributes'][2][1] ? 1 : 0,
          period: PeriodConstant.getPeriod(
            input['ixv:filterPeriods'][current['ixv:factAttributes'][3][1]]
          ),
          axes: current['ixv:factAttributes'][4][1].length
            ? current['ixv:factAttributes'][4][1]
            : null,
          members: current['ixv:factAttributes'][5][1].length
            ? current['ixv:factAttributes'][5][1]
            : null,
          measure: current['ixv:factAttributes'][6][1],
          scale: current['ixv:factAttributes'][7][1]
            ? parseInt(current['ixv:factAttributes'][7][1], 10)
            : null,
          decimals: current['ixv:factAttributes'][8][1],
          balance: current['ixv:factAttributes'][9][1],
          // END everything located in ixv:factAttributes

          htmlId: current.id,
          value: TransformationsConstant.getTransformation(
            current.value,
            current.decimals,
            current['ixv:format']
          ),
          dimensions:
            tempDimension.value && tempDimension.key
              ? {
                concept: current.dimensions.concept,
                period: current.dimensions.period,
                lang: current.dimensions.language,
                unit: current.dimensions.unit,
                value: tempDimension.value,
                key: tempDimension.key,
              }
              : null,
          references: input['ixv:references'][current['ixv:factReferences']],
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
          files: current[`ixv:files`]
            ? input['ixv:ixdsFiles'][current[`ixv:files`]]
            : xhtmlUrl,
          order: orderCount++,
        };
        arrayToBulkInsert.push(factToPutIntoDB);
        if (arrayToBulkInsert.length === 2500) {
          returnObject.active = returnObject.active.concat(
            (arrayToBulkInsert as Array<{ htmlId: string }>).map(
              (current) => current.htmlId
            )
          );

          await this.putBulkData(arrayToBulkInsert);
          arrayToBulkInsert = [];
        }
      } else {
        // todo figure out what to do with these?
        // console.log(current.value);
      }
    }
    await this.putBulkData(arrayToBulkInsert);
    returnObject.active = returnObject.active.concat(
      (arrayToBulkInsert as Array<{ files: string; htmlId: string }>)
        .map((current: { files: string; htmlId: any }) => {
          if (!settings.allFacts) {
            return current.files === xhtmlUrl ? current.htmlId : null;
          } else {
            return current.htmlId;
          }
        })
        .filter(Boolean)
    );
    return returnObject;
  }

  async getPagination(input: Array<string>, start: number, end: number) {
    return await this.facts
      .where(`htmlId`)
      .anyOf(input)
      .offset(start)
      .limit(end + 1 - start)
      .sortBy(`order`);
  }

  async getAllFacts(input?: string | false) {
    if (input) {
      return await this.table(`facts`).where({ files: input }).toArray();
    } else {
      return await this.table(`facts`).toArray();
    }
  }

  async getTotalFacts() {
    return await this.table(`facts`).count();
  }

  async getTotalFactsForModal() {
    const simpleCounts = { standard: 0, custom: 0, total: 0 };
    await this.facts.toCollection().each((fact) => {
      if (fact.isCustom) {
        simpleCounts.custom++;
      } else {
        simpleCounts.standard++;
      }
      simpleCounts.total++;
    });
    return simpleCounts;
  }

  async getHighlight(allFilters: allFilters, isFilterActive: boolean) {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    const returnObject: { highlight: Array<string>; active: Array<string> } = {
      highlight: [],
      active: [],
    };
    if (allFilters.search) {
      const regex = new RegExp(
        allFilters.search,
        `m${allFilters.searchOptions?.includes(10) ? '' : 'i'}`
      );
      returnObject.highlight = (
        await this.getAllFacts(
          settings.allFacts === 0 ? allFilters.filingUrl : false
        )
      )
        .map((fact) => {
          let highlightFact = 0;

          if (!highlightFact && allFilters.searchOptions?.includes(0)) {
            highlightFact = ConstantDatabaseFilters.searchFactName(
              regex,
              fact.tag
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(1)) {
            highlightFact = ConstantDatabaseFilters.searchFactContent(
              regex,
              fact.value
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(2)) {
            highlightFact = ConstantDatabaseFilters.searchFactLabels(
              regex,
              fact.labels
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(3)) {
            // this is technically 'Documentation'
            highlightFact = ConstantDatabaseFilters.searchFactDefinition(
              regex,
              fact.labels
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(4)) {
            highlightFact = ConstantDatabaseFilters.searchFactDimensions(
              regex,
              fact.dimensionsValue
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(5)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Topic`
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(6)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `SubTopic`
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(7)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Paragraph`
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(8)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Publisher`
            );
          }

          if (!highlightFact && allFilters.searchOptions?.includes(9)) {
            highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
              regex,
              fact.references,
              `Section`
            );
          }
          if (highlightFact) {
            return fact.htmlId;
          }
        })
        .filter(Boolean);
    } else {
      returnObject.highlight = [];
    }

    // second we do the fact filtering
    if (isFilterActive) {
      returnObject.active = (
        await this.getAllFacts(
          settings.allFacts === 0 ? allFilters.filingUrl : false
        )
      )
        .map((fact) => {
          let activateFact = 0;

          if (!activateFact && allFilters.data) {
            activateFact = ConstantDatabaseFilters.dataRadio(
              allFilters.data,
              fact
            );
          }

          if (!activateFact && allFilters.tags) {
            activateFact = ConstantDatabaseFilters.tagsRadio(
              allFilters.tags,
              fact
            );
          }

          if (!activateFact && allFilters.moreFilters.axis.length) {
            activateFact = ConstantDatabaseFilters.axisCheck(
              allFilters.moreFilters.axis,
              fact
            );
          }

          if (!activateFact && allFilters.moreFilters.balance.length) {
            activateFact = ConstantDatabaseFilters.balanceCheck(
              allFilters.moreFilters.balance,
              fact
            );
          }

          if (!activateFact && allFilters.moreFilters.members.length) {
            activateFact = ConstantDatabaseFilters.membersCheck(
              allFilters.moreFilters.members,
              fact
            );
          }

          if (!activateFact && allFilters.moreFilters.periods.length) {
            activateFact = ConstantDatabaseFilters.periodsCheck(
              allFilters.moreFilters.periods,
              fact
            );
          }

          if (!activateFact && allFilters.moreFilters.scale.length) {
            activateFact = ConstantDatabaseFilters.scaleCheck(
              allFilters.moreFilters.scale,
              fact
            );
          }

          if (activateFact) {
            return fact.htmlId;
          }
        })
        .filter(Boolean);
    } else {
      returnObject.active = (
        await this.getAllFacts(
          settings.allFacts === 0 ? allFilters.filingUrl : false
        )
      ).map((fact) => {
        return fact.htmlId;
      });
    }
    return returnObject;
  }

  async getFactById(id: string): Promise<FactsTable> {
    return await this.table('facts')
      .get(id)
      .catch((error) => {
        console.error(error);
      });
  }

  async getFactByTag(tag: string): Promise<FactsTable | undefined> {
    try {
      return this.table('facts').where({ tag }).first();
    } catch (error) {
      console.error(error);
    }
  }

  async isMultiFiling(
    returnFiles = false
  ): Promise<boolean | IndexableType | undefined> {
    try {
      return await this.table(`facts`)
        .orderBy(`files`)
        .uniqueKeys((keysArray) => {
          if (returnFiles) {
            return keysArray;
          } else {
            return keysArray.length > 1;
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  async isFactHidden(id: string): Promise<boolean | undefined> {
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
      console.error(error);
    }
  }

  async isFactText(id: string): Promise<boolean | undefined> {
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
      console.error(error);
    }
  }

  async isFactCustom(id: string): Promise<boolean | undefined> {
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
      console.error(error);
    }
  }

  async getAllSectionsData() {
    const abc = (
      await this.table(`facts`).toCollection().sortBy(`sections`)
    ).filter((fact) => {
      if (fact.sections) {
        console.log(fact.sections[0]);
        return true;
      }
      return false;
    });
    console.log(abc);
  }

  async getAllUniquePeriods(filing: string): Promise<IndexableType> {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    if (!settings.allFacts) {
      return await this.table(`facts`)
        .where({ files: filing })
        .sortBy(`period`, (facts) => {
          const uniques = facts
            .map((current) => current.period)
            .filter((element) => element !== null && element !== undefined);
          const set = [...new Set(uniques)];
          return set;
        });
    } else {
      return await this.table(`facts`).orderBy(`period`).uniqueKeys();
    }
  }

  async getAllUniqueAxes(filing: string): Promise<IndexableType> {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    if (!settings.allFacts) {
      return await this.table(`facts`)
        .where({ files: filing })
        .sortBy(`axes`, (facts) => {
          const uniques = facts
            .map((current) => {
              if (current.axes) {
                return current.axes;
              }
            })
            .filter((element) => element !== null && element !== undefined);
          const set = [...new Set(uniques)];
          return set;
        });
    } else {
      return await this.table(`facts`).orderBy(`axes`).uniqueKeys();
    }
  }

  async getAllUniqueMembers(filing: string): Promise<IndexableType> {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    if (!settings.allFacts) {
      return await this.table(`facts`)
        .where({ files: filing })
        .sortBy(`members`, (facts) => {
          const uniques = facts
            .map((current) => {
              if (current.members) {
                return current.members;
              }
            })
            .filter((element) => element !== null && element !== undefined);
          const set = [...new Set(uniques)];
          return set;
        });
    } else {
      return await this.table(`facts`).orderBy(`members`).uniqueKeys();
    }
  }

  async getAllUniqueScales(filing: string): Promise<IndexableType> {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    if (!settings.allFacts) {
      return await this.table(`facts`)
        .where({ files: filing })
        .sortBy(`scale`, (facts) => {
          const uniques = facts
            .map((current) => current.scale)
            .filter((element) => element !== null && element !== undefined);
          const set = [...new Set(uniques)];
          return set;
        });
    } else {
      return await this.table(`facts`).orderBy(`scale`).uniqueKeys();
    }
  }

  async getAllUniqueBalances(filing: string): Promise<IndexableType> {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    if (!settings.allFacts) {
      return await this.table(`facts`)
        .where({ files: filing })
        .sortBy(`balance`, (facts) => {
          const uniques = facts
            .map((current) => current.balance)
            .filter((element) => element !== null && element !== undefined);
          const set = [...new Set(uniques)];
          return set;
        });
    } else {
      return await this.table(`facts`).orderBy(`balance`).uniqueKeys();
    }
  }
}
