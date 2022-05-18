import Dexie from 'dexie';
import { DataJSON } from '../../types/data-json';
import { SectionsTable as SectionsTableType } from '../../types/sections-table';
import FilingSpecific from '../filing-specific';
export default class SectionsTable extends FilingSpecific {
  async clearSectionsTable(): Promise<void> {
    await this.table('sections').clear();
  }

  async putBulkData(input: Array<SectionsTableType>) {
    return await this.table('sections')
      .bulkPut(input)
      .catch(Dexie.BulkError, function (error) {
        // Explicitely catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error(error);
      });
  }

  async parseSectionsData(input: DataJSON) {
    let arrayToBulkInsert = [];
    for await (const current of input['ixv:edgarRendererReports']) {
      let groupType: string | null = ``;
      switch (current[`ixv:groupType`]) {
        case `document`: {
          groupType = `Document & Entity Information`;
          break;
        }
        case `statement`: {
          groupType = `Financial Statements`;
          break;
        }
        case `disclosure`: {
          groupType = `Notes to the Financial Statements`;
          break;
        }
        case `RR_Summaries`: {
          groupType = `RR Summaries`;
          break;
        }
        default: {
          groupType = null;
        }
      }
      const contextRef = current[`ixv:uniqueAnchor`]
        ? current[`ixv:uniqueAnchor`][`contextRef`]
        : null;
      const name = current[`ixv:uniqueAnchor`]
        ? current[`ixv:uniqueAnchor`][`name`]
        : null;
      const sectionToPutIntoDB: SectionsTableType = {
        reportFile: current['ixv:reportFile'],
        longName: current[`ixv:longName`],
        shortName: current[`ixv:shortName`],
        groupType: groupType,
        subGroup: current[`ixv:subGroupType`],
        baseRef: current[`ixv:uniqueAnchor`]
          ? current[`ixv:uniqueAnchor`][`baseRef`]
          : null,
        contextRef: contextRef,
        name: name,
      };
      if (sectionToPutIntoDB.groupType) {
        arrayToBulkInsert.push(sectionToPutIntoDB);
      }
      if (arrayToBulkInsert.length === 2500) {
        await this.putBulkData(arrayToBulkInsert);
        arrayToBulkInsert = [];
      }
    }
    await this.putBulkData(arrayToBulkInsert);
  }

  async getSections() {
    return this.table(`sections`).orderBy(`groupType`).toArray();
  }
}
