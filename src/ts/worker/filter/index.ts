import { ConstantFactsFilters } from '../../constants/fact-filters';
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
        highlightFact = ConstantFactsFilters.searchFactName(regex, fact.tag);
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(1) &&
        fact.value
      ) {
        highlightFact = ConstantFactsFilters.searchFactContent(
          regex,
          fact.value
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(2) &&
        fact.labels
      ) {
        highlightFact = ConstantFactsFilters.searchFactLabels(
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
        highlightFact = ConstantFactsFilters.searchFactDefinition(
          regex,
          fact.labels
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(4) &&
        fact.dimensionsValue
      ) {
        highlightFact = ConstantFactsFilters.searchFactDimensions(
          regex,
          fact.dimensionsValue
        );
      }

      if (
        !highlightFact &&
        allFilters.searchOptions?.includes(5) &&
        fact.references
      ) {
        highlightFact = ConstantFactsFilters.searchFactReferenceOptions(
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
        highlightFact = ConstantFactsFilters.searchFactReferenceOptions(
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
        highlightFact = ConstantFactsFilters.searchFactReferenceOptions(
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
        highlightFact = ConstantFactsFilters.searchFactReferenceOptions(
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
        highlightFact = ConstantFactsFilters.searchFactReferenceOptions(
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
        activateFact = ConstantFactsFilters.dataRadio(allFilters.data, fact);
      }

      if (!activateFact && allFilters.tags) {
        activateFact = ConstantFactsFilters.tagsRadio(allFilters.tags, fact);
      }

      if (!activateFact && allFilters.moreFilters.axis.length) {
        activateFact = ConstantFactsFilters.axisCheck(
          allFilters.moreFilters.axis,
          fact
        );
      }

      if (!activateFact && allFilters.moreFilters.balance.length) {
        activateFact = ConstantFactsFilters.balanceCheck(
          allFilters.moreFilters.balance,
          fact
        );
      }

      if (!activateFact && allFilters.moreFilters.members.length) {
        activateFact = ConstantFactsFilters.membersCheck(
          allFilters.moreFilters.members,
          fact
        );
      }

      if (!activateFact && allFilters.moreFilters.periods.length) {
        activateFact = ConstantFactsFilters.periodsCheck(
          allFilters.moreFilters.periods,
          fact
        );
      }

      if (!activateFact && allFilters.moreFilters.scale.length) {
        activateFact = ConstantFactsFilters.scaleCheck(
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
