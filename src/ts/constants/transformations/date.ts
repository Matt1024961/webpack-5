import moment from "moment";
import { TransformationsNumber } from "./number";

export const TransformationsDate = {

  eraStart: {
    '\u4EE4\u548C': 2018,
    '\u4EE4': 2018,
    '\u5E73\u6210': 1988,
    '\u5E73': 1988,
    '\u660E\u6CBB': 1867,
    '\u660E': 1867,
    '\u5927\u6B63': 1911,
    '\u5927': 1911,
    '\u662D\u548C': 1925,
    '\u662D': 1925
  },

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

  getGregorianHindiMonthNumber: {
    '\u091C\u0928\u0935\u0930\u0940': '01',
    '\u092B\u0930\u0935\u0930\u0940': '02',
    '\u092E\u093E\u0930\u094D\u091A': '03',
    '\u0905\u092A\u094D\u0930\u0948\u0932': '04',
    '\u092E\u0908': '05',
    '\u091C\u0942\u0928': '06',
    '\u091C\u0941\u0932\u093E\u0908': '07',
    '\u0905\u0917\u0938\u094D\u0924': '08',
    '\u0938\u093F\u0924\u0902\u092C\u0930': '09',
    '\u0905\u0915\u094D\u0924\u0942\u092C\u0930': '10',
    '\u0928\u0935\u092E\u094D\u092C\u0930': '11',
    '\u0926\u093F\u0938\u092E\u094D\u092C\u0930': '12'
  },

  getSakaMonthNumber: {
    'Chaitra': 1,
    '\u091A\u0948\u0924\u094D\u0930': 1,
    'Vaisakha': 2,
    'Vaishakh': 2,
    'Vai\u015B\u0101kha': 2,
    '\u0935\u0948\u0936\u093E\u0916': 2,
    '\u092C\u0948\u0938\u093E\u0916': 2,
    'Jyaishta': 3,
    'Jyaishtha': 3,
    'Jyaistha': 3,
    'Jye\u1E63\u1E6Dha': 3,
    '\u091C\u094D\u092F\u0947\u0937\u094D\u0920': 3,
    'Asadha': 4,
    'Ashadha': 4,
    '\u0100\u1E63\u0101\u1E0Dha': 4,
    '\u0906\u0937\u093E\u0922': 4,
    '\u0906\u0937\u093E\u0922\u093C': 4,
    'Sravana': 5,
    'Shravana': 5,
    '\u015Ar\u0101va\u1E47a': 5,
    '\u0936\u094D\u0930\u093E\u0935\u0923': 5,
    '\u0938\u093E\u0935\u0928': 5,
    'Bhadra': 6,
    'Bhadrapad': 6,
    'Bh\u0101drapada': 6,
    'Bh\u0101dra': 6,
    'Pro\u1E63\u1E6Dhapada': 6,
    '\u092D\u093E\u0926\u094D\u0930\u092A\u0926': 6,
    '\u092D\u093E\u0926\u094B': 6,
    'Aswina': 7,
    'Ashwin': 7,
    'Asvina': 7,
    '\u0100\u015Bvina': 7,
    '\u0906\u0936\u094D\u0935\u093F\u0928': 7,
    'Kartiak': 8,
    'Kartik': 8,
    'Kartika': 8,
    'K\u0101rtika': 8,
    '\u0915\u093E\u0930\u094D\u0924\u093F\u0915': 8,
    'Agrahayana': 9,
    'Agrah\u0101ya\u1E47a': 9,
    'Margashirsha': 9,
    'M\u0101rga\u015B\u012Br\u1E63a': 9,
    '\u092E\u093E\u0930\u094D\u0917\u0936\u0940\u0930\u094D\u0937': 9,
    '\u0905\u0917\u0939\u0928': 9,
    'Pausa': 10,
    'Pausha': 10,
    'Pau\u1E63a': 10,
    '\u092A\u094C\u0937': 10,
    'Magha': 11,
    'Magh': 11,
    'M\u0101gha': 11,
    '\u092E\u093E\u0918': 11,
    'Phalguna': 12,
    'Phalgun': 12,
    'Ph\u0101lguna': 12,
    '\u092B\u093E\u0932\u094D\u0917\u0941\u0928': 12
  },


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

  dateDayMonthDk: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2})[^0-9]+(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)([A-Za-z]*)([.]*)\s*$/i;
      const result = regex.exec(input);
      if (result && result.length === 5) {
        const month = result[2];
        const day = result[1];
        const monthEnd = result[3];
        const monthPer = result[4];

        if (
          ((!monthEnd && !monthPer) ||
            (!monthEnd && monthPer) ||
            (monthEnd && !monthPer)) &&
          `01` <= day &&
          day <= `${moment(month, `MMM`).daysInMonth()}`
        ) {
          const dateResult = moment(`${day}-${month}`, `DD-MMM`);
          if (!dateResult.isValid()) {
            return `Format Error: Date Day Month DK`;
          }
          return dateResult.format(`--MM-DD`);
        }
      }
    }
    return "Format Error: Date Day Month DK";
  },

  dateDayMonthEn: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2})[^0-9]+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s*$/;
      const result = regex.exec(input);
      if (result) {
        const month = result[2];
        const day = result[1];
        const dateResult = moment(`${day}-${month}`, `DD-MMM`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Day Month EN`;
        }
        return dateResult.format(`--MM-DD`);
      }
    }
    return `Format Error: Date Day Month EN`;
  },

  dateDayMonthYear: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;
      const result = regex.exec(input);
      if (result) {
        const dateResult = moment(
          input,
          [
            "DD MM YY",
            "DD.MM.YYYY",
            "DD.MM.Y",
            "DD.MM.YY",
            "D.M.YY",
            "D.M.YYYY",
            "DD/MM/YY",
            "DD/MM/YYYY",
          ],
          true
        );

        if (!dateResult.isValid()) {
          return `Format Error: Date Day Month Year`;
        }

        if (dateResult.year().toString().length === 1) {
          dateResult.year(2000 + dateResult.year());
        }

        if (dateResult.year().toString().length === 2) {
          dateResult.year(2000 + dateResult.year());
        }

        if (
          dateResult.year().toString().length === 3 &&
          result[3].length === 3
        ) {
          return `Format Error: Date Day Month Year`;
        }
        return dateResult.format(`YYYY-MM-DD`);
      }
    }
    return `Format Error: Date Day Month Year`;
  },

  dateDayMonthYearDk: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2})[^0-9]+(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)([A-Za-z]*)([.]*)[^0-9]*([0-9]{4}|[0-9]{1,2})\s*$/i;
      const result = regex.exec(input);
      if (result) {
        const year = result[5];
        const day = result[1];
        const month = moment().month(result[2]).format(`M`);
        const monthEnd = result[3];
        const monthPer = result[4];

        if (
          (month && ((!monthEnd && !monthPer) || (!monthEnd && monthPer))) ||
          (monthEnd && !monthPer)
        ) {
          const dateResult = moment(`${day}-${month}-${year}`, `DD-M-YYYY`);
          if (!dateResult.isValid()) {
            return `Format Error: Date Day Month Year DK`;
          }

          if (dateResult.year().toString().length === 1) {
            dateResult.year(2000 + dateResult.year());
          }

          if (dateResult.year().toString().length === 2) {
            dateResult.year(2000 + dateResult.year());
          }

          return dateResult.format(`YYYY-MM-DD`);
        }
      }
    }
    return `Format Error: Date Day Month Year DK`;
  },

  dateDayMonthYearEn: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2})[^0-9]+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;
      const result = regex.exec(input);
      if (result) {
        const year = result[5];
        const day = result[1];
        const month = result[2];
        const dateResult = moment(`${day}-${month}-${year}`, `DD-MMM-Y`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Day Month Year EN`;
        }
        if (dateResult.year().toString().length === 1) {
          dateResult.year(2000 + dateResult.year());
        }

        if (dateResult.year().toString().length === 2) {
          dateResult.year(2000 + dateResult.year());
        }
        return dateResult.format(`YYYY-MM-DD`);
      }
    }
    return `Format Error: Date Day Month Year EN`;
  },

  dateDayMonthYearIn: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9\u0966-\u096F]{1,2})\s([\u0966-\u096F]{2}|[^\s0-9\u0966-\u096F]+)\s([0-9\u0966-\u096F]{2}|[0-9\u0966-\u096F]{4})\s*$/;
      const result = regex.exec(input);
      if (result) {
        const year = TransformationsNumber.getDevanagariDigitsToNormal(result[3]);
        let month;
        if () {

        } else {

        }
      }
    }
    return `Format Error (date value): Date Day Month Year IN`;
  },
};
