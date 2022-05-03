import Dexie from 'dexie';

import { SettingsTable as SettingsTableType } from '../../types/settings-table';

export default class SettingsTable extends Dexie {
    settings!: Dexie.Table<SettingsTableType, number>;
    constructor() {
        super(`SEC - IXViewer - User Settings`);
        this.version(1).stores({
            // NOTE we ONLY INDEX what is necessary
            settings: `++id, hoverInfo, position, active, highlight, selected, hover, allFacts`,
        });
    }
    async setSettingsData() {
        return await this.table('settings')
            .put(
                {
                    hoverInfo: 0,
                    position: `top`,
                    active: `#FF6600`,
                    highlight: `#FFD700`,
                    selected: `#003768`,
                    hover: `rgba(255,0,0,0.3)`,
                    allFacts: 1,
                },
                1
            )
            .catch(Dexie.BulkError, function (error) {
                // Explicitely catching the bulkAdd() operation makes those successful
                // additions commit despite that there were errors.
                console.error(error);
            });
    }
}