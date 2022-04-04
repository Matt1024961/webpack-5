import { StoreData } from '../../store/data';
import { facts } from '../../types/data-json';

import { allFilters } from '../../types/filter';

const filterFacts = (data: StoreData, allFilters: allFilters) => {
  let counter = 0;
  data.facts.forEach((current) => {
    let activateFact = true;

    if (activateFact && allFilters.data) {
      activateFact = dataRadio(allFilters.data, current);
    }

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
        activateFact = searchFactDimensions(regex, current);
      }

      if (activateFact && allFilters.searchOptions.includes(5)) {
        activateFact = searchFactReferenceOptions(
          regex,
          data.references[current[`ixv:factReferences`]],
          `Topic`
        );
      }

      if (activateFact && allFilters.searchOptions.includes(6)) {
        activateFact = searchFactReferenceOptions(
          regex,
          data.references[current[`ixv:factReferences`]],
          `SubTopic`
        );
      }

      if (activateFact && allFilters.searchOptions.includes(7)) {
        activateFact = searchFactReferenceOptions(
          regex,
          data.references[current[`ixv:factReferences`]],
          `Paragraph`
        );
      }

      if (activateFact && allFilters.searchOptions.includes(8)) {
        activateFact = searchFactReferenceOptions(
          regex,
          data.references[current[`ixv:factReferences`]],
          `Publisher`
        );
      }

      if (activateFact && allFilters.searchOptions.includes(9)) {
        activateFact = searchFactReferenceOptions(
          regex,
          data.references[current[`ixv:factReferences`]],
          `Section`
        );
      }
    }

    if (activateFact) {
      counter++;
    }
    current.active = activateFact;
  });
  console.log(`Active facts: ${counter}`);

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

function searchFactDimensions(regex: RegExp, fact: facts) {
  // eslint-disable-next-line no-prototype-builtins
  if (fact.hasOwnProperty(`dimensions`)) {
    delete fact.dimensions.concept;
    delete fact.dimensions.period;
    delete fact.dimensions.unit;
    delete fact.dimensions.language;
    const dimensionValues = Object.values(fact.dimensions);
    if (dimensionValues.length) {
      const dimensionValuesAsString = dimensionValues.reduce(
        (accumulator, current) => {
          return (accumulator += ` ${current}`);
        },
        ``
      );
      return (regex as RegExp).test(dimensionValuesAsString as string);
    }
  }
  return false;
}

function searchFactReferenceOptions(
  regex: RegExp,
  factLabels: Array<string>,
  arrayKey: string
): boolean {
  if (factLabels) {
    const factTopicsAsString = factLabels
      .reduce((accumulator, current) => {
        if (current[0] === arrayKey) {
          return (accumulator += ` ${current[1]}`);
        } else {
          return accumulator;
        }
      }, ``)
      .trim();
    console.log(factTopicsAsString);
    return (regex as RegExp).test(factTopicsAsString as string);
  }
  return false;
}

function dataRadio(option: number, fact: facts): boolean {
  switch (option) {
    case 0: {
      // All
      return true;
    }
    case 1: {
      // Amounts Only
      return fact[`ixv:isnumeric`];
    }
    case 2: {
      // Text Only
      return fact[`ixv:istextonly`];
    }
    case 3: {
      // Calculations Only
      alert(`inspect!`);
      return fact[`ixv:factCalculations`][1] === null ? false : true;
    }
    case 4: {
      // Negatives Only
      return fact[`ixv:isnegativesonly`];
    }
    case 5: {
      // Additional Items Only
      return fact[`ixv:hidden`];
    }
  }
  // console.log(option);
  // console.log(fact);
  return true;
}

self.onmessage = ({ data: { data, allFilters } }) => {
  filterFacts(data, allFilters);
};
