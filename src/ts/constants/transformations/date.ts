import moment from "moment";
import { TransformationsNumber } from "./number";

export const TransformationsDate = {
  eraStart: {
    "\u4EE4\u548C": 2018,
    "\u4EE4": 2018,
    "\u5E73\u6210": 1988,
    "\u5E73": 1988,
    "\u660E\u6CBB": 1867,
    "\u660E": 1867,
    "\u5927\u6B63": 1911,
    "\u5927": 1911,
    "\u662D\u548C": 1925,
    "\u662D": 1925,
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
    "\u091C\u0928\u0935\u0930\u0940": "01",
    "\u092B\u0930\u0935\u0930\u0940": "02",
    "\u092E\u093E\u0930\u094D\u091A": "03",
    "\u0905\u092A\u094D\u0930\u0948\u0932": "04",
    "\u092E\u0908": "05",
    "\u091C\u0942\u0928": "06",
    "\u091C\u0941\u0932\u093E\u0908": "07",
    "\u0905\u0917\u0938\u094D\u0924": "08",
    "\u0938\u093F\u0924\u0902\u092C\u0930": "09",
    "\u0905\u0915\u094D\u0924\u0942\u092C\u0930": "10",
    "\u0928\u0935\u092E\u094D\u092C\u0930": "11",
    "\u0926\u093F\u0938\u092E\u094D\u092C\u0930": "12",
  },

  getSakaMonthNumber: {
    Chaitra: 1,
    "\u091A\u0948\u0924\u094D\u0930": 1,
    Vaisakha: 2,
    Vaishakh: 2,
    "Vai\u015B\u0101kha": 2,
    "\u0935\u0948\u0936\u093E\u0916": 2,
    "\u092C\u0948\u0938\u093E\u0916": 2,
    Jyaishta: 3,
    Jyaishtha: 3,
    Jyaistha: 3,
    "Jye\u1E63\u1E6Dha": 3,
    "\u091C\u094D\u092F\u0947\u0937\u094D\u0920": 3,
    Asadha: 4,
    Ashadha: 4,
    "\u0100\u1E63\u0101\u1E0Dha": 4,
    "\u0906\u0937\u093E\u0922": 4,
    "\u0906\u0937\u093E\u0922\u093C": 4,
    Sravana: 5,
    Shravana: 5,
    "\u015Ar\u0101va\u1E47a": 5,
    "\u0936\u094D\u0930\u093E\u0935\u0923": 5,
    "\u0938\u093E\u0935\u0928": 5,
    Bhadra: 6,
    Bhadrapad: 6,
    "Bh\u0101drapada": 6,
    "Bh\u0101dra": 6,
    "Pro\u1E63\u1E6Dhapada": 6,
    "\u092D\u093E\u0926\u094D\u0930\u092A\u0926": 6,
    "\u092D\u093E\u0926\u094B": 6,
    Aswina: 7,
    Ashwin: 7,
    Asvina: 7,
    "\u0100\u015Bvina": 7,
    "\u0906\u0936\u094D\u0935\u093F\u0928": 7,
    Kartiak: 8,
    Kartik: 8,
    Kartika: 8,
    "K\u0101rtika": 8,
    "\u0915\u093E\u0930\u094D\u0924\u093F\u0915": 8,
    Agrahayana: 9,
    "Agrah\u0101ya\u1E47a": 9,
    Margashirsha: 9,
    "M\u0101rga\u015B\u012Br\u1E63a": 9,
    "\u092E\u093E\u0930\u094D\u0917\u0936\u0940\u0930\u094D\u0937": 9,
    "\u0905\u0917\u0939\u0928": 9,
    Pausa: 10,
    Pausha: 10,
    "Pau\u1E63a": 10,
    "\u092A\u094C\u0937": 10,
    Magha: 11,
    Magh: 11,
    "M\u0101gha": 11,
    "\u092E\u093E\u0918": 11,
    Phalguna: 12,
    Phalgun: 12,
    "Ph\u0101lguna": 12,
    "\u092B\u093E\u0932\u094D\u0917\u0941\u0928": 12,
  },

  eraYear: (era: string, year: string) => {
    if (era && TransformationsDate.eraStart[era] && year) {
      return (
        TransformationsDate.eraStart[era] +
        (year === `\u5143` ? 1 : parseInt(year))
      );
    }
    return null;
  },

  printDurationType: (
    year: number | null,
    month: number | null,
    day: number | null,
    hour: number | null,
    negative: any
  ) => {
    // preprocess each value so we don't print P0Y0M0D
    let sign = negative ? `-` : ``;
    let empty = true;

    empty = empty && (year === null || year === 0);
    empty = empty && (month === null || month === 0);
    empty = empty && (day === null || day === 0);
    empty = empty && (hour === null || hour === 0);

    if (empty) {
      sign = ``;
      let firstZero = false;
      if (year !== null && year == 0) {
        firstZero = true;
      }
      if (month !== null && month === 0) {
        if (firstZero) {
          month = null;
        } else {
          firstZero = true;
        }
      }
      if (day !== null && day === 0) {
        if (firstZero) {
          day = null;
        } else {
          firstZero = true;
        }
      }

      if (hour !== null && hour === 0) {
        if (firstZero) {
          hour = null;
        } else {
          firstZero = true;
        }
      }
    }

    let output = `${sign}P`;
    if (year !== null) {
      output += `${year}Y`;
    }
    if (month !== null) {
      output += `${month}M`;
    }
    if (day !== null) {
      output += `${day}D`;
    }
    if (hour !== null) {
      output += `T${hour}H`;
    }
    return output;
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

  getDuration: (input: string) => {
    const possibleFloat = parseFloat(input);
    if (isNaN(possibleFloat)) {
      return {
        negative: false,
        value: null,
        error: true,
      };
    }
    const negative = !isNaN(possibleFloat) && possibleFloat < 0 ? true : false;
    return {
      negative: negative,
      value: Math.abs(possibleFloat),
      error: false,
    };
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
        const year = TransformationsNumber.getDevanagariDigitsToNormal(
          result[3]
        );

        const month = TransformationsDate.getGregorianHindiMonthNumber[
          TransformationsNumber.getDevanagariDigitsToNormal(result[2])
        ]
          ? TransformationsDate.getGregorianHindiMonthNumber[
          TransformationsNumber.getDevanagariDigitsToNormal(result[2])
          ]
          : TransformationsNumber.getDevanagariDigitsToNormal(result[2]);

        const day = TransformationsNumber.getDevanagariDigitsToNormal(
          result[1]
        );

        const dateResult = moment(`${day}-${month}-${year}`, `DD-MM-YYYY`);

        if (!dateResult.isValid()) {
          return `Format Error (date value): Date Day Month Year IN`;
        }
        return dateResult.format(`YYYY-MM-DD`);
      }
    }
    return `Format Error (date value): Date Day Month Year IN`;
  },

  dateDotEu: (input: string) => {
    if (input) {
      const dateResult = moment(input, "DD.MM.Y");
      if (!dateResult.isValid()) {
        return `Format Error: Date Dot EU`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Dot EU`;
  },

  dateDotUs: (input: string) => {
    if (input) {
      const dateResult = moment(input, `MM.DD.Y`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Dot US`;
      }
      return dateResult.format("YYYY-MM-DD");
    }
    return `Format Error: Date Dot US`;
  },

  dateEraYearMonthDayJp: (input: string) => {
    if (input) {
      const regex =
        /^[\s ]*(\u660E\u6CBB|\u660E|\u5927\u6B63|\u5927|\u662D\u548C|\u662D|\u5E73\u6210|\u5E73|\u4EE4\u548C|\u4EE4)[\s ]*([0-9\uFF10-\uFF19]{1,2}|\u5143)[\s ]*(\u5E74)[\s ]*([0-9\uFF10-\uFF19]{1,2})[\s ]*(\u6708)[\s ]*([0-9\uFF10-\uFF19]{1,2})[\s ]*(\u65E5)[\s]*$/;
      const result = TransformationsNumber.jpDigitsToNormal(input)
        ? regex.exec(TransformationsNumber.jpDigitsToNormal(input) as string)
        : null;

      if (result) {
        const year = TransformationsDate.eraYear(result[1], result[2]);
        const month = result[4];
        const day = result[6];

        const dateResult = moment(`${day}-${month}-${year}`, `DD-MM-Y`);

        if (!dateResult.isValid()) {
          return `Format Error: Date Era Year Month Day JP`;
        }
        return dateResult.format(`YYYY-MM-DD`);
      }
    }
    return `Format Error: Date Era Year Month Day JP`;
  },

  dateEraYearMonthJp: (input: string) => {
    if (input) {
      const regex =
        /^[\s ]*(\u660E\u6CBB|\u660E|\u5927\u6B63|\u5927|\u662D\u548C|\u662D|\u5E73\u6210|\u5E73|\u4EE4\u548C|\u4EE4)[\s ]*([0-9\uFF10-\uFF19]{1,2}|\u5143)[\s ]*(\u5E74)[\s ]*([0-9\uFF10-\uFF19]{1,2})[\s ]*(\u6708)[\s ]*$/;
      const result = TransformationsNumber.jpDigitsToNormal(input)
        ? regex.exec(TransformationsNumber.jpDigitsToNormal(input) as string)
        : null;
      if (result) {
        const year = TransformationsDate.eraYear(result[1], result[2]);
        const month = result[4];
        const dateResult = moment(`${month}-${year}`, `MM-Y`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Era Year Month JP`;
        }
        return dateResult.format(`YYYY-MM`);
      }
    }
    return `Format Error: Date Era Year Month JP`;
  },

  dateLongMonthYear: (input: string) => {
    if (input) {
      const dateResult = moment(input, [`MMMM YY`, `MMMM YYYY`], true);
      if (!dateResult.isValid()) {
        return `Format Error: Date Long Month Year`;
      }
      return dateResult.format(`YYYY-MM`);
    }
    return `Format Error: Date Long Month Year`;
  },

  dateLongUk: (input: string) => {
    if (input) {
      const dateResult = moment(input, `DD MMM YY`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Long UK`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Long UK`;
  },

  dateLongUs: (input: string) => {
    if (input) {
      const dateResult = moment(input, `MMM DD, YY`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Long US`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Long US`;
  },

  dateLongYearMonth: (input: string) => {
    if (input) {
      const dateResult = moment(input, `YY MMM`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Long Year Month`;
      }
      return dateResult.format(`YYYY-MM`);
    }
    return `Format Error: Date Long Year Month`;
  },

  dateMonthDay: (input: string) => {
    if (input) {
      const dateResult = moment(input, `MMDD`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Month Day`;
      }
      return dateResult.format(`--MM-DD`);
    }
    return `Format Error: Date Month Day`;
  },

  dateMonthDayEn: (input: string) => {
    if (input) {
      const regex =
        /^\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]{1,2})[A-Za-z]{0,2}\s*$/;
      const result = regex.exec(input);
      if (result) {
        const month = result[1];
        const day = result[2];
        const dateResult = moment(`${month}-${day}`, `MMM-DD`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Month Day EN`;
        }
        return dateResult.format(`--MM-DD`);
      }
    }
    return `Format Error: Date Month Day EN`;
  },

  dateMonthDayYear: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;
      const result = regex.exec(input);
      if (result) {
        const year = result[3];
        const month = result[1];
        const day = result[2];
        const dateResult = moment(`${year}-${month}-${day}`, [
          `YY-MM-DD`,
          `YYYY-MM-DD`,
        ]);
        if (!dateResult.isValid()) {
          return `Format Error: Date Month Day Year`;
        }
        return dateResult.format(`YYYY-MM-DD`);
      }
    }
    return `Format Error: Date Month Day Year`;
  },

  dateMonthDayYearEn: (input: string) => {
    if (input) {
      const regex =
        /^\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]+)[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;

      const result = regex.exec(input);
      if (result) {
        const year = result[3];
        const month = result[1];
        const day = result[2];
        const dateResult = moment(`${year}-${month}-${day}`, [
          `YY-MM-DD`,
          `YYYY-MM-DD`,
        ]);
        if (!dateResult.isValid()) {
          return `Format Error: Date Month Day Year EN`;
        }
        return dateResult.format(`YYYY-MM-DD`);
      }
    }
    return `Format Error: Date Month Day Year EN`;
  },

  dateMonthYear: (input: string) => {
    if (input) {
      const regex =
        /^[\s\u00A0]*([0-9]{1,2})[^0-9]+([0-9]{4}|[0-9]{1,2})[\s\u00A0]*$/;

      const result = regex.exec(input);
      if (result) {
        const year = result[3];
        const month = result[1];
        const dateResult = moment(`${year}-${month}`, [`YY-MM`]);
        if (!dateResult.isValid()) {
          return `Format Error: Date Month Year`;
        }
        return dateResult.format(`YYYY-MM`);
      }
    }
    return `Format Error: Date Month Year`;
  },

  dateMonthYearDk: (input: string) => {
    if (input) {
      const regex =
        /^\s*(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)([A-Za-z]*)([.]*)[^0-9]*([0-9]{4}|[0-9]{1,2})\s*$/i;

      const result = regex.exec(input);
      if (result) {
        const year = result[3];
        const month = result[1];
        const dateResult = moment(
          `${year}-${month}`,
          [`YYYY-MMM`, `YY-MMM`, `Y-MMM`],
          true
        );
        if (!dateResult.isValid()) {
          return `Format Error: Date Month Year DK`;
        }

        if (dateResult.year().toString().length === 1) {
          dateResult.year(2000 + dateResult.year());
        }

        if (dateResult.year().toString().length === 2) {
          dateResult.year(2000 + dateResult.year());
        }

        return dateResult.format(`YYYY-MM`);
      }
    }
    return `Format Error: Date Month Year DK`;
  },

  dateMonthYearEn: (input: string) => {
    if (input) {
      const regex =
        /^\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]{1,2}|[0-9]{4})\s*$/i;

      const result = regex.exec(input);
      if (result) {
        const year = result[3];
        const month = result[1];
        const dateResult = moment(`${year}-${month}`, [`YYYY-MMM`]);
        if (!dateResult.isValid()) {
          return `Format Error: Date Month Year EN`;
        }

        if (dateResult.year().toString().length === 1) {
          dateResult.year(2000 + dateResult.year());
        }

        if (dateResult.year().toString().length === 2) {
          dateResult.year(2000 + dateResult.year());
        }

        return dateResult.format(`YYYY-MM`);
      }
    }
    return `Format Error: Date Month Year EN`;
  },

  dateMonthYearIn: (input: string) => {
    if (input) {
      const regex = /^\s*([^\s0-9\u0966-\u096F]+)\s([0-9\u0966-\u096F]{4})\s*$/;

      const result = regex.exec(input);
      if (result) {
        if (result[1] in TransformationsDate.getGregorianHindiMonthNumber) {
          const year = TransformationsNumber.getDevanagariDigitsToNormal(
            result[2]
          );
          const month = TransformationsNumber.getDevanagariDigitsToNormal(
            result[1]
          );
          const dateResult = moment(`${month}-${year}`, `MM-YYYY`);
          if (!dateResult.isValid()) {
            return `Format Error: Date Month Year IN`;
          }
          return dateResult.format(`YYYY-MM`);
        }
      }
    }
    return `Format Error: Date Month Year IN`;
  },

  dateShortDayMonthUk: (input: string) => {
    if (input) {
      const dateResult = moment(input, `DD MM`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Short Day Month UK`;
      }
      return dateResult.format(`--MM-DD`);
    }
    return `Format Error: Date Short Day Month UK`;
  },

  dateShortEu: (input: string) => {
    console.error(`TODO`, input);
  },

  dateShortMonthDayUs: (input: string) => {
    if (input) {
      const dateResult = moment(input, `MMM DD`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Short Day Month US`;
      }
      return dateResult.format(`--MM-DD`);
    }
    return `Format Error: Date Short Day Month US`;
  },

  dateShortMonthYear: (input: string) => {
    if (input) {
      const dateResult = moment(input, `MMM YYYY`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Short Month Year`;
      }
      return dateResult.format(`YYYY-MM`);
    }
    return `Format Error: Date Short Month Year`;
  },

  dateShortUk: (input: string) => {
    if (input) {
      const dateResult = moment(input, [`DD MMM YY`, `DD MMM YYYY`]);
      if (!dateResult.isValid()) {
        return `Format Error: Date Short UK`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Short UK`;
  },

  dateShortUs: (input: string) => {
    if (input) {
      const dateResult = moment(input, [`MMM DD, YY`, `MMM DD, YYYY`]);
      if (!dateResult.isValid()) {
        return `Format Error: Date Short US`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Short US`;
  },

  dateShortYearMonth: (input: string) => {
    if (input) {
      const dateResult = moment(input, [`YY MMM`, `YYYY MMM`]);
      if (!dateResult.isValid()) {
        return `Format Error: Date Short Year Month`;
      }
      return dateResult.format(`YYYY-MM`);
    }
    return `Format Error: Date Short Year Month`;
  },

  dateSlashDayMonthEu: (input: string) => {
    if (input) {
      const dateResult = moment(input, `DD/MM`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Slash Day Month EU`;
      }
      return dateResult.format(`--MM-DD`);
    }
    return `Format Error: Date Slash Day Month EU`;
  },

  dateSlashEu: (input: string) => {
    if (input) {
      const dateResult = moment(input, [`DD/MM/YY`, `DD/MM/YYYY`]);
      if (!dateResult.isValid()) {
        return `Format Error: Date Slash EU`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Slash EU`;
  },

  dateSlashMonthDayUs: (input: string) => {
    if (input) {
      const dateResult = moment(input, `MM/DD`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Slash Month Day US`;
      }
      return dateResult.format(`--MM-DD`);
    }
    return `Format Error: Date Slash Month Day US`;
  },

  dateSlashUs: (input: string) => {
    if (input) {
      const dateResult = moment(input, [`MM/DD/YY`, `MM/DD/YYYY`]);
      if (!dateResult.isValid()) {
        return `Format Error: Date Slash EU`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Slash EU`;
  },

  dateQuarterEnd: (input: string) => {
    if (input) {
      const regex =
        /1st|1|first|q1|2nd|2|second|q2|3rd|3|third|q3|4th|4|fourth|last|q4/gi;
      const result = input.match(regex);
      const year = input.match(/\d{4}/) ? input.match(/\d{4}/) : null;
      let month;
      let day;
      if (result && result[0]) {
        switch (result[0].toLowerCase()) {
          case `1st`: {
            month = `03`;
            day = `31`;
            break;
          }
          case `first`: {
            month = `03`;
            day = `31`;
            break;
          }
          case `q1`: {
            month = `03`;
            day = `31`;
            break;
          }
          case `2nd`: {
            month = `06`;
            day = `30`;
            break;
          }
          case `second`: {
            month = `06`;
            day = `30`;
            break;
          }
          case `q2`: {
            month = `06`;
            day = `30`;
            break;
          }
          case `3rd`: {
            month = `09`;
            day = `30`;
            break;
          }
          case `third`: {
            month = `09`;
            day = `30`;
            break;
          }
          case `q3`: {
            month = `09`;
            day = `30`;
            break;
          }
          case `4th`: {
            month = `12`;
            day = `31`;
            break;
          }
          case `fourth`: {
            month = `12`;
            day = `31`;
            break;
          }
          case `last`: {
            month = `12`;
            day = `31`;
            break;
          }
          case `q4`: {
            month = `12`;
            day = `31`;
            break;
          }
          default: {
            return `Format Error: Date Quarter End`;
          }
        }
      } else {
        return `Format Error: Date Quarter End`;
      }
      const dateResult = moment(`${year}-${month}-${day}`, `YYYY-MM-DD`);
      if (!dateResult.isValid()) {
        return `Format Error: Date Quarter End`;
      }
      return dateResult.format(`YYYY-MM-DD`);
    }
    return `Format Error: Date Quarter End`;
  },

  dateYearMonthCjk: (input: string) => {
    if (input) {
      const regex =
        /^[\s\u00A0]*([0-9]{4}|[0-9]{1,2})[\s\u00A0]*\u5E74[\s\u00A0]*([0-9]{1,2})[\s\u00A0]*\u6708\s*$/;
      const result = TransformationsNumber.jpDigitsToNormal(input)
        ? regex.exec(TransformationsNumber.jpDigitsToNormal(input) as string)
        : null;
      if (result) {
        const year = result[1];
        const month = result[2];
        const dateResult = moment(`${year}-${month}`, `YYYY-MM`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Year Month CJK`;
        }
        if (dateResult.year().toString().length === 1) {
          dateResult.year(2000 + dateResult.year());
        }

        if (dateResult.year().toString().length === 2) {
          dateResult.year(2000 + dateResult.year());
        }
        return dateResult.format(`YYYY-MM`);
      }
    }
    return `Format Error: Date Year Month CJK`;
  },

  dateYearMonthDay: (input: string) => {
    if (input) {
      const regex =
        /^[\s\u00A0]*([0-9]{4}|[0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{1,2})[\s\u00A0]*$/;
      const result = regex.exec(input);

      if (result) {
        const year = result[1];
        const month = result[2];
        const day = result[3];
        const dateResult = moment(
          `${year}-${month}-${day}`,
          [`YYYY-MM-DD`, `YYYY-MM-D`, `YYYY-M-DD`, `YY-M-DD`, `Y-M-DD`],
          true
        );
        if (!dateResult.isValid()) {
          return `Format Error: Date Year Month Day`;
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
    return `Format Error: Date Year Month Day`;
  },

  dateYearMonthDayCjk: (input: string) => {
    if (input) {
      const regex =
        /^[\s\u00A0]*([0-9]{4}|[0-9]{1,2})[\s\u00A0]*\u5E74[\s\u00A0]*([0-9]{1,2})[\s\u00A0]*\u6708[\s\u00A0]*([0-9]{1,2})[\s\u00A0]*\u65E5[\s\u00A0]*$/;
      const result = TransformationsNumber.jpDigitsToNormal(input)
        ? regex.exec(TransformationsNumber.jpDigitsToNormal(input) as string)
        : null;

      if (result) {
        const year = result[1];
        const month = result[2];
        const day = result[3];
        const dateResult = moment(`${year}-${month}-${day}`, `YYYY-MM-DD`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Year Month Day CJK`;
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
    return `Format Error: Date Year Month Day CJK`;
  },

  dateYearMonthEn: (input: string) => {
    if (input) {
      const regex =
        /^\s*([0-9]{1,2}|[0-9]{4})[^0-9]+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s*$/;
      const result = regex.exec(input);

      if (result) {
        const year = result[1];
        const month = result[2];
        const dateResult = moment(`${month}-${year}`, `MMM-Y`);
        if (!dateResult.isValid()) {
          return `Format Error: Date Year Month EN`;
        }
        if (dateResult.year().toString().length === 1) {
          dateResult.year(2000 + dateResult.year());
        }

        if (dateResult.year().toString().length === 2) {
          dateResult.year(2000 + dateResult.year());
        }
        return dateResult.format(`YYYY-MM`);
      }
    }
    return `Format Error: Date Year Month EN`;
  },

  durYear: (input: string) => {
    if (input) {
      const durationObject = TransformationsDate.getDuration(input);
      if (durationObject.error) {
        return `Format Error: Dur Year`;
      }
      const years = Math.floor(durationObject.value as number);
      let months: number | null =
        ((durationObject.value as number) - years) * 12;
      let days: number | null = (months - Math.floor(months)) * 30.4375;

      if (months === 0) {
        months = null;
      }
      if (days === 0) {
        days = null;
      }
      return TransformationsDate.printDurationType(
        years,
        months !== null ? Math.floor(months) : null,
        days !== null ? Math.floor(days) : null,
        null,
        durationObject.negative
      );
    }
    return `Format Error: Dur Year`;
  },

  durMonth: (input: string) => {
    if (input) {
      const durationObject = TransformationsDate.getDuration(input);
      if (durationObject.error) {
        return `Format Error: Dur Month`;
      }
      const months: number | null = Math.floor(durationObject.value as number);
      let days: number | null = Math.floor(
        ((durationObject.value as number) - months) * 30.4375
      );
      if (days === 0) {
        days = null;
      }
      return TransformationsDate.printDurationType(
        null,
        months,
        days !== null ? Math.floor(days) : null,
        null,
        durationObject.negative
      );
    }
    return `Format Error: Dur Month`;
  },

  durWeek: (input: string) => {
    if (input) {
      const durationObject = TransformationsDate.getDuration(input);
      if (durationObject.error) {
        return `Format Error: Dur Week`;
      }
      let days: number | null = Math.floor(
        (durationObject.value as number) * 7
      );
      if (days === 0) {
        days = null;
      }
      return TransformationsDate.printDurationType(
        null,
        null,
        days !== null ? Math.floor(days) : null,
        null,
        durationObject.negative
      );
    }
    return `Format Error: Dur Week`;
  },

  durDay: (input: string) => {
    if (input) {
      const durationObject = TransformationsDate.getDuration(input);
      if (durationObject.error) {
        return `Format Error: Dur Day`;
      }
      const days: number | null = Math.floor(durationObject.value as number);
      let hours: number | null = Math.floor(
        ((durationObject.value as number) - days) * 24
      );
      if (hours === 0) {
        hours = null;
      }
      return TransformationsDate.printDurationType(
        null,
        null,
        days !== null ? days : null,
        hours !== null ? hours : null,
        durationObject.negative
      );
    }
    return `Format Error: Dur Day`;
  },

  durHour: (input: string) => {
    if (input) {
      const durationObject = TransformationsDate.getDuration(input);
      if (durationObject.error) {
        return `Format Error: Dur Hour`;
      }
      let hours: number | null = Math.floor(durationObject.value as number);
      if (hours === 0) {
        hours = null;
      }
      return TransformationsDate.printDurationType(
        null,
        null,
        null,
        hours !== null ? hours : null,
        durationObject.negative
      );
    }
    return `Format Error: Dur Hour`;
  },

  durWordsEn: (input: string) => {
    if (input) {
      const regex1 = /^\s*[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]?([Zz]ero|[Nn]o(ne)?)[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]?\s*$/;
      const regex2 =
        /^\s*[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]?([Zz]ero|[Nn]o(ne)?)[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]?\s*$/;
      const regex3 = /,|\sand\s/g;
      const result = regex1.exec(input);
      if (result && input.trim().length > 0) {
        let dur = `P`;
        const group = [
          [1 + 1, `Y`],
          [62 + 1, `M`],
          [122 + 1, `D`],
        ];
        for (let i = 0; i < group.length; i++) {
          const groupIndex = group[i][0];
          const groupSuffix = group[i][1];
          const groupPart = result[groupIndex];
          if (groupPart && groupPart !== null) {
            if (regex2.exec(groupPart) === null) {
              if (isNaN(groupPart)) {
                const temp = groupPart
                  .trim()
                  .toLowerCase()
                  .replace(regex3, ` `);
                dur += TransformationsNumber.textToNumber(temp);
              } else {
                dur += groupPart;
              }
              dur += groupSuffix;
            }
          }
        }
        return dur.length > 1 ? dur : `P0D`;
      }
    }
    return `Format Error: Dur Words EN`;
  },
};
