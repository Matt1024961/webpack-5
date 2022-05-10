export const TransformationsNumber = {
  numDotDecimal: (input: string) => {
    // const t = /^(([0-9]{1,2}[, \xA0])?([0-9]{2}[, \xA0])*[0-9]{3})([.][0-9]+)?$|^([0-9]+)([.][0-9]+)?$/.exec(input);
    // console.log(t);
    return TransformationsNumber.simpleFormatting(input);
  },
  numDotDecimalTR4: (input: string) => {
    return TransformationsNumber.simpleFormatting(input);
  },

  numWordsEn: (input: string) => {
    return input;
  },

  zeroDash: (input: string) => {
    const regex = /^\s*([-]| |\u002D|\u002D|\u058A|\u05BE|\u2010|\u2011|\u2012|\u2013|\u2014|\u2015|\uFE58|\uFE63|\uFF0D)\s*$/;
    if (regex.test(input)) {
      return `0`;
    }
    return `Format Error: Zero Dash`;
  },

  simpleFormatting: (input: string) => {
    return input.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  },
};
