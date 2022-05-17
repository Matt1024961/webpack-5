import Dexie from 'dexie';
import { FactsTable as FactsTableType } from '../../types/facts-table';
import { SectionsTable as SectionsTableType } from '../../types/sections-table';
export default class FilingSpecific extends Dexie {
    facts!: Dexie.Table<FactsTableType, number>;
    sections!: Dexie.Table<SectionsTableType, number>;
    constructor(url: string) {
        super(`SEC - IXViewer - ${url}`);
        this.version(1).stores({
            // NOTE we ONLY INDEX what is necessary
            facts: `++htmlId, order, isHtml, isNegative, isNumeric, isText, isHidden, isCustom, period, axes, members, scale, balance, tag, files, [htmlId+isHidden], [htmlId+isText]`,
            sections: `++id, reportFile, longName, shortName, groupType, subGroup, baseRef, contextRef, name`
        });
    }
}