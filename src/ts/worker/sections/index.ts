import { ConstantSectionFilters } from '../../constants/section-filters';
import { sections, sectionsOptions } from "../../types/filter";
import { SectionsTable } from "../../types/sections-table";

const filterAllSections = (
  filingUrl: string,
  allSections: Array<SectionsTable>,
  allFilters: { sections: sections, sectionsOptions: sectionsOptions }
) => {
  return allSections.map((section: SectionsTable) => {
    let activateSection = false;
    if (allFilters.sectionsOptions?.includes(3)) {
      // return all of them
      activateSection = true;
    } else if (allFilters.sectionsOptions?.includes(4)) {
      // return only same URL
      if (section.baseRef === filingUrl) {
        activateSection = true;
      } else {
        activateSection = false;
      }
    } else if (allFilters.sectionsOptions?.includes(5)) {
      // return only different URL
      if (section.baseRef === filingUrl) {
        activateSection = false;
      } else {
        activateSection = true;
      }
    }

    if (allFilters.sections && activateSection) {
      const regex = new RegExp(
        allFilters.sections,
        `m${allFilters.sectionsOptions?.includes(6) ? '' : 'i'}`
      );
      activateSection = false;


      if (!activateSection && allFilters.sectionsOptions?.includes(0) && section.shortName) {
        activateSection = ConstantSectionFilters.searchShortName(regex, section.shortName);
      }

      if (!activateSection && allFilters.sectionsOptions?.includes(1) && section.longName) {
        activateSection = ConstantSectionFilters.searchLongName(regex, section.longName);
      }
      if (!activateSection && allFilters.sectionsOptions?.includes(2) && section.reportFile) {
        activateSection = ConstantSectionFilters.searchReportFile(regex, section.reportFile);
      }

      section.isActive = activateSection;
      return section;
    }
    section.isActive = activateSection;
    return section;
  });


};

self.onmessage = async ({ data }) => {
  self.postMessage({
    sections: filterAllSections(
      data.url,
      data.allSections,
      data.allFilters
    ),
  });
};
