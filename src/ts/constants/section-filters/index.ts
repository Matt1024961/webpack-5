export const ConstantSectionFilters = {

    searchShortName: (regex: RegExp, shortName: string): boolean => {
        return (regex as RegExp).test(shortName) ? true : false;
    },

    searchLongName: (regex: RegExp, longName: string): boolean => {
        return (regex as RegExp).test(longName) ? true : false;
    },

    searchReportFile: (regex: RegExp, reportFile: string): boolean => {
        return (regex as RegExp).test(reportFile) ? true : false;
    },
};