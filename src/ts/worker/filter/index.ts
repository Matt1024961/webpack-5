import { ConstantDatabaseFilters } from '../../constants/database-filters';
import { FactsTable } from '../../types/facts-table';
import { allFilters } from '../../types/filter';

const filterAllFacts = (
  url: string,
  allFilters: allFilters,
  isFilterActive: boolean,
  allFacts: Array<FactsTable>
) => {
  return allFacts.map((fact: FactsTable) => {
    if (allFilters.search) {
      const regex = new RegExp(
        allFilters.search,
        `m${allFilters.searchOptions?.includes(10) ? '' : 'i'}`
      );

      let highlightFact = 0;

      if (!highlightFact && allFilters.searchOptions?.includes(0) && fact.tag) {
        highlightFact = ConstantDatabaseFilters.searchFactName(regex, fact.tag);
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(1) &&
        fact.value
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactContent(
          regex,
          fact.value
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(2) &&
        fact.labels
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactLabels(
          regex,
          fact.labels
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(3) &&
        fact.labels
      ) {
        // this is technically 'Documentation'
        highlightFact = ConstantDatabaseFilters.searchFactDefinition(
          regex,
          fact.labels
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(4) &&
        fact.dimensionsValue
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactDimensions(
          regex,
          fact.dimensionsValue
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(5) &&
        fact.references
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
          regex,
          fact.references,
          `Topic`
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(6) &&
        fact.references
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
          regex,
          fact.references,
          `SubTopic`
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(7) &&
        fact.references
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
          regex,
          fact.references,
          `Paragraph`
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(8) &&
        fact.references
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
          regex,
          fact.references,
          `Publisher`
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(9) &&
        fact.references
      ) {
        highlightFact = ConstantDatabaseFilters.searchFactReferenceOptions(
          regex,
          fact.references,
          `Section`
        );
      }
      if (highlightFact) {
        fact.isHighlight = true;
      } else {
        fact.isHighlight = false;
      }
    } else {
      fact.isHighlight = false;
    }
    if (isFilterActive) {
      let activateFact = 0;

      if (!activateFact && allFilters.data) {
        activateFact = ConstantDatabaseFilters.dataRadio(allFilters.data, fact);
      }

      if (!activateFact && allFilters.tags) {
        activateFact = ConstantDatabaseFilters.tagsRadio(allFilters.tags, fact);
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
        fact.isActive = true;
      } else {
        fact.isActive = false;
      }
      return fact;
    } else {
      fact.isActive = true;
    }
    return fact;
  });
};

self.onmessage = async ({ data }) => {
  self.postMessage({
    facts: filterAllFacts(
      data.url,
      data.allFilters,
      data.isFilterActive,
      data.allFacts
    ),
  });
};
