//import { Fact } from '../../components/modals/fact';
import { StoreData } from '../../store/data';
import { facts } from '../../types/data-json';

import { allFilters } from '../../types/filter';

const filterFacts = (data: StoreData, allFilters: allFilters) => {
  const updatedFacts = data.facts.reduce(
    (
      accumulator: { filter: Array<string>; highlight: Array<string> },
      current
    ) => {
      // first we do all of the fact highlighting
      if (!allFilters.search) {
        // we all ZERO Fact IDs to the highlight array
      } else {
        // the user has entered something into the search box
        let highlightFact = false;
        const regex = new RegExp(
          allFilters.search,
          `m${allFilters.searchOptions.includes(10) ? '' : 'i'}`
        );

        if (!highlightFact && allFilters.searchOptions.includes(0)) {
          if (current[`ixv:factAttributes`]) {
            highlightFact = searchFactName(
              regex,
              current[`ixv:factAttributes`][0][1]
            );
          }
        }

        if (!highlightFact && allFilters.searchOptions.includes(1)) {
          highlightFact = searchFactContent(regex, current.value);
        }

        if (!highlightFact && allFilters.searchOptions.includes(2)) {
          highlightFact = searchFactLabels(
            regex,
            data.labels[current[`ixv:factLabels`]]
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(3)) {
          // this is technically "Documentation"
          highlightFact = searchFactDefinition(
            regex,
            data.labels[current[`ixv:factLabels`]]
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(4)) {
          highlightFact = searchFactDimensions(regex, current);
        }

        if (!highlightFact && allFilters.searchOptions.includes(5)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            data.references[current[`ixv:factReferences`]],
            `Topic`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(6)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            data.references[current[`ixv:factReferences`]],
            `SubTopic`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(7)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            data.references[current[`ixv:factReferences`]],
            `Paragraph`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(8)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            data.references[current[`ixv:factReferences`]],
            `Publisher`
          );
        }

        if (!highlightFact && allFilters.searchOptions.includes(9)) {
          highlightFact = searchFactReferenceOptions(
            regex,
            data.references[current[`ixv:factReferences`]],
            `Section`
          );
        }

        if (highlightFact) {
          accumulator.highlight.push(current.id);
        }
      }
      // second we do the fact filtering
      let activateFact = true;
      if (activateFact && allFilters.data) {
        activateFact = dataRadio(allFilters.data, current);
      }

      if (activateFact && allFilters.tags) {
        activateFact = tagsRadio(
          allFilters.tags,
          current,
          Object.keys(data.ixvExtensionNamespaces)
        );
      }

      if (activateFact && allFilters.moreFilters.axis.length) {
        activateFact = axisCheck(allFilters.moreFilters.axis, current);
      }

      if (activateFact && allFilters.moreFilters.balance.length) {
        activateFact = balanceCheck(allFilters.moreFilters.balance, current);
      }

      if (activateFact && allFilters.moreFilters.members.length) {
        activateFact = membersCheck(allFilters.moreFilters.members, current);
      }

      if (activateFact && allFilters.moreFilters.measures.length) {
        activateFact = measuresCheck(allFilters.moreFilters.measures, current);
      }

      if (activateFact && allFilters.moreFilters.periods.length) {
        activateFact = periodsCheck(allFilters.moreFilters.periods, current);
      }

      if (activateFact && allFilters.moreFilters.scale.length) {
        activateFact = scaleCheck(allFilters.moreFilters.scale, current);
      }

      if (activateFact) {
        accumulator.filter.push(current.id);
      }
      return accumulator;
    },
    { filter: [], highlight: [] }
  );

  self.postMessage({
    updatedFacts,
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

const searchFactName = (regex: RegExp, factName: string): boolean => {
  return (regex as RegExp).test(factName);
};

const searchFactLabels = (
  regex: RegExp,
  factLabels: Array<string>
): boolean => {
  const factLabelsAsString = factLabels
    ?.slice(1)
    .reduce((accumulator, current) => {
      return (accumulator += ` ${current[1]}`);
    }, ``)
    .trim();
  return (regex as RegExp).test(factLabelsAsString);
};

const searchFactDefinition = (
  regex: RegExp,
  factLabels: Array<string>
): boolean => {
  const factDefinitionAsString = factLabels[0][1];
  return (regex as RegExp).test(factDefinitionAsString);
};

const searchFactDimensions = (regex: RegExp, fact: facts) => {
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
};

const searchFactReferenceOptions = (
  regex: RegExp,
  factLabels: Array<string>,
  arrayKey: string
): boolean => {
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
    return (regex as RegExp).test(factTopicsAsString as string);
  }
  return false;
};

const dataRadio = (option: number, fact: facts): boolean => {
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
      if (fact[`ixv:factCalculations`]) {
        return fact[`ixv:factCalculations`][1] === null ? false : true;
      }
      break;
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
  return true;
};

const tagsRadio = (
  option: number,
  fact: facts,
  extensionNameSpaces: Array<string>
): boolean => {
  switch (option) {
    case 0: {
      // All
      return true;
    }
    case 1: {
      // Standard Only
      if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][0]) {
        const factType = fact[`ixv:factAttributes`][0][1].substr(
          0,
          fact[`ixv:factAttributes`][0][1].indexOf(`:`)
        );
        return !extensionNameSpaces.includes(factType);
      }
      break;
    }
    case 2: {
      // Custom Only
      if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][0]) {
        const factType = fact[`ixv:factAttributes`][0][1].substr(
          0,
          fact[`ixv:factAttributes`][0][1].indexOf(`:`)
        );
        return extensionNameSpaces.includes(factType);
      }
      break;
    }
  }
  return true;
};

const axisCheck = (option: Array<string>, fact: facts): boolean => {
  if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][4]) {
    return option.some((element) =>
      fact[`ixv:factAttributes`][4][1].includes(element)
    );
  }
};

const balanceCheck = (option: Array<string>, fact: facts): boolean => {
  if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][9]) {
    return option.includes(fact[`ixv:factAttributes`][9][1]);
  }
};

const membersCheck = (option: Array<string>, fact: facts): boolean => {
  if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][5]) {
    return option.some((element) =>
      fact[`ixv:factAttributes`][5][1].includes(element)
    );
  }
};

const measuresCheck = (option: Array<number>, fact: facts): boolean => {
  console.log(`todotodotodotodo`);
  console.log(option);
  console.log(fact);
  return true;
};

const periodsCheck = (option: Array<number>, fact: facts): boolean => {
  if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][3]) {
    return option.includes(parseInt(fact[`ixv:factAttributes`][3][1], 10));
  }
};

const scaleCheck = (option: Array<number>, fact: facts): boolean => {
  if (fact[`ixv:factAttributes`] && fact[`ixv:factAttributes`][7]) {
    return option.includes(parseInt(fact[`ixv:factAttributes`][7][1], 10));
  }
};

self.onmessage = ({ data: { data, allFilters } }) => {
  filterFacts(data, allFilters);
};
