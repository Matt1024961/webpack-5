import { StoreData } from '../../store/data';

import { allFilters } from '../../types/filter';

const filterFacts = (data: StoreData, allFilters: allFilters) => {

  let activateFact = false;
  let counter = 0;
  data.facts.forEach((current) => {
    // the user has entered something into the search box
    if (allFilters.search) {
      // the user has entered something into the search box
      const regex = new RegExp(
        allFilters.search,
        `m${allFilters.searchOptions.includes(10) ? '' : 'i'}`
      );
      activateFact = searchString(regex, current.value);
    }
    if (activateFact) {
      counter++;
    }
    current.active = activateFact;
  });
  console.log(counter);

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

const searchString = (regex: RegExp, value: string): boolean => {
  if (!value) {
    return false;
  }
  const newValue = value
    .replace(/( |<([^>]+)>)/gi, ` `)
    .replace(/ +(?= )/g, ``);
  return (regex as RegExp).test(newValue);
};

self.onmessage = ({ data: { data, allFilters } }) => {
  filterFacts(data, allFilters);
};
