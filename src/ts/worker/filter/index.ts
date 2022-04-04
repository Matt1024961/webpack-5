import { StoreData } from '../../store/data';
import { facts } from '../../types/data-json';

import { allFilters } from '../../types/filter';

const filterFacts = (data: StoreData, allFilters: allFilters) => {
  let counter = 0;
  data.facts.forEach((current) => {
    let activateFact = true;

    if (allFilters.search) {
      // the user has entered something into the search box
      const regex = new RegExp(
        allFilters.search,
        `m${allFilters.searchOptions.includes(10) ? '' : 'i'}`
      );

      if (activateFact && allFilters.searchOptions.includes(0)) {

        activateFact = searchFactName(
          regex,
          current[`ixv:factAttributes`][0][1]
        );
      }

      if (activateFact && allFilters.searchOptions.includes(1)) {
        activateFact = searchFactContent(regex, current.value);
      }

      if (activateFact && allFilters.searchOptions.includes(2)) {
        activateFact = searchFactLabels(
          regex,
          data.labels[current[`ixv:factLabels`]]
        );
      }

      if (activateFact && allFilters.searchOptions.includes(3)) {
        // this is technically "Documentation"
        activateFact = searchFactDefinition(
          regex,
          data.labels[current[`ixv:factLabels`]]
        );
      }

      if (activateFact && allFilters.searchOptions.includes(4)) {
        // eslint-disable-next-line no-prototype-builtins
        console.log(searchFactDimensions(regex, current, data.facts));
        activateFact = searchFactDimensions(regex, current, data.facts);
      }
    }

    if (activateFact) {
      console.log(activateFact);
      counter++;
    }
    current.active = activateFact;
  });
  console.log(`Active facts: ${counter}`);

  // searchOptions
  // 0 => fact name
  // element[`ixv:factAttributes][0][1]
  // 1 => fact content
  // element.value
  // 2 => labels
  // element[`ixv:standardLabel`]
  // 3 => definitions

  // 4 => dimensions
  // 5 => topic
  // 6 => sub-topic
  // 7 => paragraph
  // 8 => publisher
  // 9 => section
  // 10 => match case (for regex)
  const filteredFacts = [`123`];

  self.postMessage({
    filteredFacts,
  });
};

const searchFactContent = (regex: RegExp, value: string): boolean => {
  if (!value) {
    return false;
  }
  const newValue = value
    .replace(/( |<([^>]+)>)/gi, ` `)
    .replace(/ +(?= )/g, ``);
  return (regex as RegExp).test(newValue);
};

function searchFactName(regex: RegExp, factName: string): boolean {
  return (regex as RegExp).test(factName);
}

function searchFactLabels(regex: RegExp, factLabels: Array<string>): boolean {
  const factLabelsAsString = factLabels
    .slice(1)
    .reduce((accumulator, current) => {
      return (accumulator += ` ${current[1]}`);
    }, ``)
    .trim();
  return (regex as RegExp).test(factLabelsAsString);
}

function searchFactDefinition(
  regex: RegExp,
  factLabels: Array<string>
): boolean {
  const factDefinitionAsString = factLabels[0][1];
  return (regex as RegExp).test(factDefinitionAsString);
}

function searchFactDimensions(
  regex: RegExp,
  fact: facts,
  allFacts: Array<facts>
) {
  // eslint-disable-next-line no-prototype-builtins
  if (fact.hasOwnProperty(`dimensions`)) {
    const found = allFacts.filter((element) => {
      return element[`ixv:factAttributes`][0][1] === fact.dimensions.concept;
    });
    if (found) {
      const factValuesAsString = found.reduce((accumulator, current) => {
        if (current.value) {
          const newValue = current.value
            .replace(/( |<([^>]+)>)/gi, ` `)
            .replace(/ +(?= )/g, ``);

          return (accumulator += ` ${newValue}`);
        }
      }, ``);
      return (regex as RegExp).test(factValuesAsString);
    }
  }
  return false;
}

self.onmessage = ({ data: { data, allFilters } }) => {
  filterFacts(data, allFilters);
};
