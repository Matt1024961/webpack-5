import BigNumber from "bignumber.js";

export const TransformationsNumber = {
  getSmallNumber: {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  },
  getMagnitude: {
    thousand: 1000,
    million: 1000000,
    billion: 1000000000,
    trillion: 1000000000000,
    quadrillion: 1000000000000000,
    quintillion: 1000000000000000000,
    sextillion: 1000000000000000000000,
    septillion: 1000000000000000000000000,
    octillion: 1000000000000000000000000000,
    nonillion: 1000000000000000000000000000,
    decillion: 1000000000000000000000000000,
  },

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

  jpDigitsToNormal: (input: string) => {
    if (input) {
      let normal = ``;
      for (let i = 0; i < input.length; i++) {
        const d = input[i];
        if (`\uFF10` <= d && d <= `\uFF19`) {
          normal += String.fromCharCode(
            d.charCodeAt(0) - 0xff10 + `0`.charCodeAt(0)
          );
        } else {
          normal += d;
        }
      }
      return normal;
    }
    return null;
  },

  textToNumber: (input: string) => {
    const regex =
      /[\s|-|\u002D\u002D\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D]+/g;
    const splitInput = input.toString().split(regex);
    let n = new BigNumber(0);
    let g = new BigNumber(0);

    for (let i = 0; i < splitInput.length; i++) {
      const w = splitInput[i];
      let x = TransformationsNumber.getSmallNumber[w];
      if (x && x !== null) {
        g = g.plus(x);
      } else if (w === `hundred`) {
        g = g.times(100);
      } else {
        x = TransformationsNumber.getMagnitude[w];
        if (x && x !== null) {
          const tempMagnitude = new BigNumber(x);
          const tempAddition = g.times(tempMagnitude);
          n = n.plus(tempAddition);
          g = new BigNumber(0);
        } else {
          return `ixt:text2numError ${w}`;
        }
      }
    }
  },
};
