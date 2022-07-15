import moment from "moment";
import { TransformationsNumber } from "./number";

export const TransformationsDate = {
  gregorianDaysInMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  sakaMonthLength: [30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30],

  sakaMonthOffset: [
    [3, 22, 0],
    [4, 21, 0],
    [5, 22, 0],
    [6, 22, 0],
    [7, 23, 0],
    [8, 23, 0],
    [9, 23, 0],
    [10, 23, 0],
    [11, 22, 0],
    [12, 22, 0],
    [1, 21, 1],
    [2, 20, 1],
  ],

  getSakaToGregorian: (year: number, month: number, day: number) => {
    if (!year && !month && !day) {
      return null;
    }
    let gregorianYear = year + 78;

    const startsInLeapYear =
      gregorianYear % 4 === 0 &&
      (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0);

    if (gregorianYear < 0) {
      return `Saka calendar year not supported: ${year} ${month} ${day}`;
    }

    if (month < 1 || month > 12) {
      return `Saka calendar month error: ${year} ${month} ${day}`;
    }

    let monthLength = TransformationsDate.sakaMonthLength[month - 1];

    if (startsInLeapYear && month === 1) {
      monthLength++;
    }

    if (day < 1 || day > monthLength) {
      return `Saka calendar day error: ${year} ${month} ${day}`;
    }

    const monthOffset = TransformationsDate.sakaMonthOffset[month - 1];
    let gregorianMonth = monthOffset[0];
    let gregorianDayOffset = monthOffset[1];
    const gregorianYearOffset = monthOffset[2];
    if (startsInLeapYear && month === 1) {
      gregorianDayOffset--;
    }
    gregorianYear += gregorianYearOffset;
    let gregorianMonthLength =
      TransformationsDate.gregorianDaysInMonths[gregorianMonth - 1];
    if (
      gregorianMonth === 2 &&
      gregorianYear % 4 === 0 &&
      gregorianYear % 100 !== 0 &&
      gregorianYear % 400 !== 0
    ) {
      gregorianMonthLength++;
    }
    let gregorianDay = gregorianDayOffset + day - 1;
    if (gregorianDay > gregorianMonthLength) {
      gregorianDay -= gregorianMonthLength;
      gregorianMonth++;
      if (gregorianMonth === 13) {
        gregorianMonth = 1;
        gregorianYear++;
      }
    }
    return `${gregorianYear}-${gregorianMonth}-${gregorianDay}`;
  },

  getSakaYearPadding: (year: string | null, month: number, day: number) => {
    // zero pad to 4 digits
    if (year) {
      if (typeof year === `number`) {
        year = year.toString();
      }
      if (year?.length === 2) {
        if (year > `21` || (year === `21` && month >= 10 && day >= 11)) {
          return `19${year}`;
        }
        return `20${year}`;
      }
      return year;
    }
    return null;
  },

  calINDayMonthYear: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9\u0966-\u096F]{1,2})\s([\u0966-\u096F]{2}|[^\s0-9\u0966-\u096F]+)\s([0-9\u0966-\u096F]{2}|[0-9\u0966-\u096F]{4})\s*$/;
      const regexSakaMonth =
        /(C\S*ait|\u091A\u0948\u0924\u094D\u0930)|(Vai|\u0935\u0948\u0936\u093E\u0916|\u092C\u0948\u0938\u093E\u0916)|(Jy|\u091C\u094D\u092F\u0947\u0937\u094D\u0920)|(dha|\u1E0Dha|\u0906\u0937\u093E\u0922|\u0906\u0937\u093E\u0922\u093C)|(vana|\u015Ar\u0101va\u1E47a|\u0936\u094D\u0930\u093E\u0935\u0923|\u0938\u093E\u0935\u0928)|(Bh\S+dra|Pro\u1E63\u1E6Dhapada|\u092D\u093E\u0926\u094D\u0930\u092A\u0926|\u092D\u093E\u0926\u094B)|(in|\u0906\u0936\u094D\u0935\u093F\u0928)|(K\S+rti|\u0915\u093E\u0930\u094D\u0924\u093F\u0915)|(M\S+rga|Agra|\u092E\u093E\u0930\u094D\u0917\u0936\u0940\u0930\u094D\u0937|\u0905\u0917\u0939\u0928)|(Pau|\u092A\u094C\u0937)|(M\S+gh|\u092E\u093E\u0918)|(Ph\S+lg|\u092B\u093E\u0932\u094D\u0917\u0941\u0928)/;

      const result = regex.exec(input);

      if (result) {
        const resultSaka = regexSakaMonth.exec(result[2]);
        if (resultSaka) {
          // let month = 0;
          for (let month = resultSaka.length - 1; month >= 0; month -= 1) {
            if (resultSaka[month]) {
              const day = parseInt(
                TransformationsNumber.getDevanagariDigitsToNormal(result[1])
              );
              if (result[3] && month && day) {
                const year = parseInt(
                  TransformationsNumber.getDevanagariDigitsToNormal(
                    TransformationsDate.getSakaYearPadding(
                      result[3],
                      month,
                      day
                    )
                  )
                );

                const returnResult = moment(
                  TransformationsDate.getSakaToGregorian(year, month, day),
                  [`YYYY-MM-DD`, `YYYY-M-D`],
                  true
                );
                if (!returnResult.isValid()) {
                  return `Format Error: Cal IN Day Month Year`;
                }
                return returnResult.format(`YYYY-MM-DD`);
                break;
              }
            }
          }
        }
      }
      return `Format Error: Cal IN Day Month Year`;
    }
  },

  dateDayMonth: (input: string) => {
    if (input) {
      const result = moment(input, `DDMM`);
      if (!result.isValid()) {
        return "Format Error: Date Day Month";
      }
      return result.format(`--MM-DD`);
    }
    return "Format Error: Date Day Month";
  },
};
