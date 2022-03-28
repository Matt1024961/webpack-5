import { facts } from '../../types/data-json';

const filterFacts = (facts: Array<facts>, search: string) => {
  const filteredFacts = facts
    .filter((element) => {
      if (element.value) {
        return element.value.includes(search) ? element.id : false;
      } else {
        return false;
      }
    });

  console.log(filteredFacts);
  self.postMessage({
    filteredFacts,
  });
};

self.onmessage = ({ data: { facts, search } }) => {
  filterFacts(facts, search);
};
