export const TransformationsNumber = {
  fixedZero: () => {
    return `0`;
  },
  numDotDecimal: (input: string) => {
    return TransformationsNumber.simpleFormatting(input);
  },
  numDotDecimalTR4: (input: string) => {
    return TransformationsNumber.simpleFormatting(input);
  },
  numWordsEn: (input: string) => {
    return input;
  },
  zeroDash: (input: string) => {
    const regex =
      /^\s*([-]| |\u002D|\u002D|\u058A|\u05BE|\u2010|\u2011|\u2012|\u2013|\u2014|\u2015|\uFE58|\uFE63|\uFF0D)\s*$/;
    if (regex.test(input)) {
      return `0`;
    }
    return `Format Error: Zero Dash`;
  },
  simpleFormatting: (input: string) => {
    return input.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  },

  getDevanagariDigitsToNormal: (input: string) => {
    if (input) {
      let normal = ``;
      for (let i = 0; i < input.length; i++) {
        const d = input[i];
        if (`\u0966` <= d && d <= `\u096F`) {
          normal = `${normal}${String.fromCharCode(
            d.charCodeAt(0) - 0x0966 + `0`.charCodeAt(0)
          )}`;
        } else {
          normal = `${normal}${d}`;
        }
      }
      return normal;
    }
    return "09";
  },
};
