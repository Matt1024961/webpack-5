import { facts } from '../../types/data-json';

const filterFacts = (facts: Array<facts>, search: string) => {
  const filteredFacts = facts
    .map((element) => {
      return element.value.includes(search) ? element.id : false;
    })
    .filter(Boolean);

  self.postMessage({
    filteredFacts,
  });
};

self.onmessage = ({ data: { facts, search } }) => {
  filterFacts(facts, search);
};
