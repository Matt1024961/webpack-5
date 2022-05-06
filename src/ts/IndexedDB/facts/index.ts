import Dexie, { IndexableType } from 'dexie';
import * as moment from 'moment';
import { ConstantDatabaseFilters } from '../../constants/database-filters';
import { TransformationsNumber } from '../../constants/transformations/number';
import { DataJSON } from '../../types/data-json';
import { FactsTable as FactsTableType } from '../../types/facts-table';
import { allFilters } from '../../types/filter';
import SettingsTable from '../settings';
export default class FactsTable extends Dexie {
  facts!: Dexie.Table<FactsTableType, number>;

  constructor(url: string) {
    super(`SEC - IXViewer - ${url}`);
    this.version(1).stores({
      // NOTE we ONLY INDEX what is necessary
      facts: `++htmlId, order, isHtml, isNegative, isNumeric, isText, isHidden, isCustom, period, axes, members, scale, balance, tag, files, [htmlId+isHidden], [htmlId+isText]`,
    });
  }

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

  async parseData(input: DataJSON, xhtmlUrl: string) {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    xhtmlUrl = xhtmlUrl.split('/').slice(1).pop().split(`?`)[0];
    const returnObject: { highlight: Array<string>; active: Array<string> } = {
      highlight: [],
      active: [],
    };
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
          value: this.getTransformation(
            current.value,
            current.decimals,
            current['ixv:format']
          ),
          dimensions: {
            concept: current.dimensions.concept,
            period: current.dimensions.period,
            lang: current.dimensions.language,
            unit: current.dimensions.unit,
            value: tempDimension.value,
            key: tempDimension.key,
          },
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
            arrayToBulkInsert.map((current) => current.htmlId)
          );

          await this.putBulkData(arrayToBulkInsert);
          arrayToBulkInsert = [];
        }
      } else {
        // todo figure out what to do with these?
        // console.log(current.value);
      }
      // if (current.links) {
      //   console.log(current.links[`ftTyp_fact-footnote`][`ftGrp_default`][0]);
      // }
      //console.log(current.links);
    }
    await this.putBulkData(arrayToBulkInsert);

    returnObject.active = returnObject.active.concat(
      arrayToBulkInsert
        .map((current) => {
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

  getTransformation(input: string, _decimals: number | null, format: string) {
    const formatArray = format ? format.split(`:`) : [null, null];
    // eslint-disable-next-line @typescript-eslint/ban-types
    const transformationsObject: { [key: string]: null | unknown } = {
      booleanfalse: null,
      booleantrue: null,
      boolballotbox: null,
      yesnoballotbox: null,
      countrynameen: null,
      stateprovnameen: null,
      exchnameen: null,
      entityfilercategoryen: null,
      edgarprovcountryen: null,
      calindaymonthyear: null,
      datedaymonth: null,
      datedaymonthdk: null,
      datedaymonthen: null,
      datedaymonthyear: null,
      datedaymonthyeardk: null,
      datedaymonthyearen: null,
      datedaymonthyearin: null,
      datedoteu: null,
      datedotus: null,
      dateerayearmonthdayjp: null,
      dateerayearmonthjp: null,
      datelongmonthyear: null,
      datelonguk: null,
      datelongus: null,
      datelongyearmonth: null,
      datemonthday: null,
      datemonthdayen: null,
      datemonthdayyear: null,
      datemonthdayyearen: null,
      datemonthyear: null,
      datemonthyeardk: null,
      datemonthyearen: null,
      datemonthyearin: null,
      dateshortdaymonthuk: null,
      dateshorteu: null,
      dateshortmonthdayus: null,
      dateshortmonthyear: null,
      dateshortuk: null,
      dateshortus: null,
      dateshortyearmonth: null,
      dateslashdaymontheu: null,
      dateslasheu: null,
      dateslashmonthdayus: null,
      dateslashus: null,
      datequarterend: null,
      dateyearmonthcjk: null,
      dateyearmonthday: null,
      dateyearmonthdaycjk: null,
      dateyearmonthen: null,
      duryear: null,
      durmonth: null,
      durweek: null,
      durday: null,
      durhour: null,
      durwordsen: null,
      nocontent: null,
      numcomma: null,
      numcommadecimal: null,
      numcommadot: null,
      numdash: null,
      numdotcomma: null,
      numdotdecimal: null,
      numdotdecimalin: null,
      numspacecomma: null,
      numspacedot: null,
      numunitdecimal: null,
      numunitdecimalin: null,
      numwordsen: null,
      zerodash: null,
      'date-day-month': null,
      'date-day-monthname-bg': null,
      'date-day-monthname-cs': null,
      'date-day-monthname-da': null,
      'date-day-monthname-de': null,
      'date-day-monthname-el': null,
      'date-day-monthname-en': null,
      'date-day-monthname-es': null,
      'date-day-monthname-et': null,
      'date-day-monthname-fi': null,
      'date-day-monthname-fr': null,
      'date-day-monthname-hr': null,
      'date-day-monthname-it': null,
      'date-day-monthname-lv': null,
      'date-day-monthname-nl': null,
      'date-day-monthname-no': null,
      'date-day-monthname-pl': null,
      'date-day-monthname-pt': null,
      'date-day-monthname-ro': null,
      'date-day-monthname-sk': null,
      'date-day-monthname-sl': null,
      'date-day-monthname-sv': null,
      'date-day-monthroman': null,
      'date-day-month-year': null,
      'date-day-monthname-year-bg': null,
      'date-day-monthname-year-cs': null,
      'date-day-monthname-year-da': null,
      'date-day-monthname-year-de': null,
      'date-day-monthname-year-el': null,
      'date-day-monthname-year-en': null,
      'date-day-monthname-year-es': null,
      'date-day-monthname-year-et': null,
      'date-day-monthname-year-fi': null,
      'date-day-monthname-year-fr': null,
      'date-day-monthname-year-hi': null,
      'date-day-monthname-year-hr': null,
      'date-day-monthname-year-it': null,
      'date-day-monthname-year-nl': null,
      'date-day-monthname-year-no': null,
      'date-day-monthname-year-pl': null,
      'date-day-monthname-year-pt': null,
      'date-day-monthname-year-ro': null,
      'date-day-monthname-year-sk': null,
      'date-day-monthname-year-sl': null,
      'date-day-monthname-year-sv': null,
      'date-day-monthroman-year': null,
      'date-ind-day-monthname-year-hi': null,
      'date-jpn-era-year-month-day': null,
      'date-jpn-era-year-month': null,
      'date-monthname-day-en': null,
      'date-monthname-day-hu': null,
      'date-monthname-day-lt': null,
      'date-monthname-day-year-en': null,
      'date-month-day': null,
      'date-month-day-year': null,
      'date-month-year': null,
      'date-monthname-year-bg': null,
      'date-monthname-year-cs': null,
      'date-monthname-year-da': null,
      'date-monthname-year-de': null,
      'date-monthname-year-el': null,
      'date-monthname-year-en': null,
      'date-monthname-year-es': null,
      'date-monthname-year-et': null,
      'date-monthname-year-fi': null,
      'date-monthname-year-fr': null,
      'date-monthname-year-hi': null,
      'date-monthname-year-hr': null,
      'date-monthname-year-it': null,
      'date-monthname-year-nl': null,
      'date-monthname-year-no': null,
      'date-monthname-year-pl': null,
      'date-monthname-year-pt': null,
      'date-monthname-year-ro': null,
      'date-monthname-year-sk': null,
      'date-monthname-year-sl': null,
      'date-monthname-year-sv': null,
      'date-monthroman-year': null,
      'date-year-day-monthname-lv': null,
      'date-year-month': null,
      'date-year-month-day': null,
      'date-year-monthname-en': null,
      'date-year-monthname-hu': null,
      'date-year-monthname-day-hu': null,
      'date-year-monthname-day-lt': null,
      'date-year-monthname-lt': null,
      'date-year-monthname-lv': null,
      'fixed-empty': null,
      'fixed-false': null,
      'fixed-true': null,
      'fixed-zero': null,
      'num-comma-decimal': null,
      'num-dot-decimal': TransformationsNumber.numDotDecimalTR4,
      'num-unit-decimal': null,
      'date-day-monthname-cy': null,
      'date-day-monthname-year-cy': null,
      'date-monthname-year-cy': null,
      'num-comma-decimal-apos': null,
      'num-dot-decimal-apos': null,
      'num-unit-decimal-apos': null,
    };
    if (formatArray[1]) {
      Object.keys(transformationsObject).forEach((current) => {
        if (formatArray[1].toLowerCase() === current) {
          if (transformationsObject[current]) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            return (transformationsObject[current] as Function).call(
              this,
              input
            );
          }
        }
      });
    }
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
        `m${allFilters.searchOptions.includes(10) ? '' : 'i'}`
      );
      returnObject.highlight = (
        await this.getAllFacts(
          settings.allFacts === 0 ? allFilters.filingUrl : false
        )
      )
        .map((fact) => {
          let highlightFact = 0;

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
            // this is technically 'Documentation'
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

  async getFactByTag(tag: string): Promise<FactsTable> {
    try {
      return this.table('facts').where({ tag }).first();
    } catch (error) {
      console.error(error);
    }
  }

  async isMultiFiling(returnFiles = false): Promise<boolean | IndexableType> {
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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
    }
  }

  async getAllUniquePeriods(filing: string): Promise<IndexableType> {
    const db: SettingsTable = new SettingsTable();
    const settings = await db.getSettingsData();
    if (!settings.allFacts) {
      return await this.table(`facts`)
        .where({ files: filing })
        .sortBy(`period`, (facts) => {
          const uniques = facts.map((current) => current.period);
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
            .filter(Boolean);
          const set = [...new Set(uniques)];
          return set;
          //}
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
            .filter(Boolean);
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
          const uniques = facts.map((current) => current.scale);
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
          const uniques = facts.map((current) => current.balance);
          const set = [...new Set(uniques)];
          return set;
        });
    } else {
      return await this.table(`facts`).orderBy(`balance`).uniqueKeys();
    }
  }
}
