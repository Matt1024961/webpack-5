import { FactsTable } from '../../types/facts-table';

export const ConstantDatabaseFilters = {
  searchFactName: (regex: RegExp, factName: string): boolean => {
    return (regex as RegExp).test(factName);
  },

  searchFactContent: (regex: RegExp, value: string): boolean => {
    if (!value) {
      return false;
    }
    const newValue = value
      .replace(/( |<([^>]+)>)/gi, ` `)
      .replace(/ +(?= )/g, ``);

    return (regex as RegExp).test(newValue);
  },

  searchFactLabels: (regex: RegExp, factLabels: Array<string>): boolean => {
    const factLabelsAsString = factLabels
      ?.slice(1)
      .reduce((accumulator, current) => {
        return (accumulator += ` ${current[1]}`);
      }, ``)
      .trim();
    return (regex as RegExp).test(factLabelsAsString);
  },

  searchFactDefinition: (regex: RegExp, factLabels: Array<string>): boolean => {
    if (factLabels && factLabels[0] && factLabels[0][1]) {
      const factDefinitionAsString = factLabels[0][1];
      return (regex as RegExp).test(factDefinitionAsString);
    }
  },

  searchFactDimensions: (regex: RegExp, dimensions: Array<string>) => {
    if (dimensions) {
      const dimensionValuesAsString = dimensions.reduce(
        (accumulator, current) => {
          return (accumulator += ` ${current}`);
        },
        ``
      );
      return (regex as RegExp).test(dimensionValuesAsString as string);
    }
    return false;
  },

  searchFactReferenceOptions: (
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
  },

  dataRadio: (option: number, fact: FactsTable): boolean => {
    switch (option) {
      case 0: {
        // All
        return true;
      }
      case 1: {
        // Amounts Only
        return fact.isNumeric ? true : false;
      }
      case 2: {
        // Text Only
        return fact.isNumeric ? false : true;
      }
      case 3: {
        // Calculations Only
        if (fact.calculations !== null && fact.calculations[1]) {
          return false;
        }
        return true;
      }
      case 4: {
        // Negatives Only
        return fact.isNegative ? true : false;
      }
      case 5: {
        // Additional Items
        return fact.isHidden ? true : false;
      }
    }
  },

  tagsRadio: (option: number, fact: FactsTable): boolean => {
    switch (option) {
      case 0: {
        // All
        return false;
      }
      case 1: {
        // Standard Only
        return fact.isCustom ? false : true;
      }
      case 2: {
        // Custom Only
        return fact.isCustom ? true : false;
      }
    }
  },

  axisCheck: (option: Array<string>, fact: FactsTable): boolean => {
    return option.some((element) =>
      (fact.axes as Array<string>).includes(element)
    );
  },

  balanceCheck: (option: Array<string>, fact: FactsTable): boolean => {
    return option.includes(fact.balance);
  },

  membersCheck: (option: Array<string>, fact: FactsTable): boolean => {
    return option.some((element) => fact.members.includes(element));
  },

  periodsCheck: (option: Array<string>, fact: FactsTable): boolean => {
    return option.includes(fact.period);
  },

  scaleCheck: (option: Array<number>, fact: FactsTable): boolean => {
    return option.includes(fact.scale);
  },
};
