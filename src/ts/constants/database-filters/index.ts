import { FactsTable } from '../../types/facts-table';

export const ConstantDatabaseFilters = {
  searchFactName: (regex: RegExp, factName: string): 0 | 1 => {
    return (regex as RegExp).test(factName) ? 1 : 0;
  },

  searchFactContent: (regex: RegExp, value: string): 0 | 1 => {
    if (!value) {
      return 0;
    }
    const newValue = value
      .replace(/( |<([^>]+)>)/gi, ` `)
      .replace(/ +(?= )/g, ``);

    return (regex as RegExp).test(newValue) ? 1 : 0;
  },

  searchFactLabels: (regex: RegExp, factLabels: Array<string>): 1 | 0 => {
    const factLabelsAsString = factLabels
      ?.slice(1)
      .reduce((accumulator, current) => {
        return (accumulator += ` ${current[1]}`);
      }, ``)
      .trim();
    return (regex as RegExp).test(factLabelsAsString) ? 1 : 0;
  },

  searchFactDefinition: (regex: RegExp, factLabels: Array<string>): 1 | 0 => {
    if (factLabels && factLabels[0] && factLabels[0][1]) {
      const factDefinitionAsString = factLabels[0][1];
      return (regex as RegExp).test(factDefinitionAsString) ? 1 : 0;
    }
  },

  searchFactDimensions: (regex: RegExp, dimensions: Array<string>): 1 | 0 => {
    if (dimensions) {
      const dimensionValuesAsString = dimensions.reduce(
        (accumulator, current) => {
          return (accumulator += ` ${current}`);
        },
        ``
      );
      return (regex as RegExp).test(dimensionValuesAsString as string) ? 1 : 0;
    }
    return 0;
  },

  searchFactReferenceOptions: (
    regex: RegExp,
    factLabels: Array<string>,
    arrayKey: string
  ): 1 | 0 => {
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
      return (regex as RegExp).test(factTopicsAsString as string) ? 1 : 0;
    }
    return 0;
  },

  dataRadio: (option: number, fact: FactsTable): 0 | 1 => {
    switch (option) {
      case 0: {
        // All
        return 1;
      }
      case 1: {
        // Amounts Only
        return fact.isNumeric ? 1 : 0;
      }
      case 2: {
        // Text Only
        return fact.isNumeric ? 0 : 1;
      }
      case 3: {
        // Calculations Only
        if (fact.calculations !== null && fact.calculations[1]) {
          return 0;
        }
        return 1;
      }
      case 4: {
        // Negatives Only
        return fact.isNegative ? 1 : 0;
      }
      case 5: {
        // Additional Items
        return fact.isHidden ? 1 : 0;
      }
    }
  },

  tagsRadio: (option: number, fact: FactsTable): 0 | 1 => {
    switch (option) {
      case 0: {
        // All
        return 0;
      }
      case 1: {
        // Standard Only
        return fact.isCustom ? 0 : 1;
      }
      case 2: {
        // Custom Only
        return fact.isCustom ? 1 : 0;
      }
    }
  },

  axisCheck: (option: Array<string>, fact: FactsTable): 0 | 1 => {
    if (fact.axes) {
      return option.some((element) =>
        (fact.axes as Array<string>).includes(element)
      )
        ? 1
        : 0;
    }
    return 0;
  },

  balanceCheck: (option: Array<string>, fact: FactsTable): 0 | 1 => {
    return option.includes(fact.balance) ? 1 : 0;
  },

  membersCheck: (option: Array<string>, fact: FactsTable): 0 | 1 => {
    if (fact.members) {
      return option.some((element) => fact.members.includes(element)) ? 1 : 0;
    }
    return 0;
  },

  periodsCheck: (option: Array<string>, fact: FactsTable): 0 | 1 => {
    return option.includes(fact.period) ? 1 : 0;
  },

  scaleCheck: (option: Array<number>, fact: FactsTable): 0 | 1 => {
    return option.includes(fact.scale) ? 1 : 0;
  },
};
