import { TransformationsBoolean } from "./boolean";
import { TransformationsDate } from "./date";
import { TransformationsEdgar } from "./edgar";
import { TransformationsGeography } from "./geography";
import { TransformationsNumber } from "./number";

export const TransformationsConstant = {
  getTransformation: (
    input: string,
    _decimals: number | null,
    format: string,
    factId: string,
  ) => {
    const formatArray = format ? format.split(`:`) : [null, null];
    // eslint-disable-next-line @typescript-eslint/ban-types
    const transformationsObject: { [key: string]: null | unknown } = {
      booleanfalse: TransformationsBoolean.booleanFalse,
      booleantrue: TransformationsBoolean.booleanTrue,
      boolballotbox: TransformationsBoolean.boolBallotBox,
      yesnoballotbox: TransformationsBoolean.yesNoBallotBox,
      countrynameen: TransformationsGeography.countryNameEn,
      stateprovnameen: TransformationsGeography.stateProvNameEn,
      exchnameen: TransformationsEdgar.exchNameEn,
      entityfilercategoryen: TransformationsEdgar.entityFilerCategoryEn,
      edgarprovcountryen: TransformationsGeography.edgarProvCountryEn,
      calindaymonthyear: TransformationsDate.calINDayMonthYear,
      datedaymonth: TransformationsDate.dateDayMonth,
      datedaymonthdk: TransformationsDate.dateDayMonthDk,
      datedaymonthen: TransformationsDate.dateDayMonthEn,
      datedaymonthyear: TransformationsDate.dateDayMonthYear,
      datedaymonthyeardk: TransformationsDate.dateDayMonthYearDk,
      datedaymonthyearen: TransformationsDate.dateDayMonthYearEn,
      datedaymonthyearin: TransformationsDate.dateDayMonthYearIn,
      datedoteu: TransformationsDate.dateDotEu,
      datedotus: TransformationsDate.dateDotUs,
      dateerayearmonthdayjp: TransformationsDate.dateEraYearMonthDayJp,
      dateerayearmonthjp: TransformationsDate.dateEraYearMonthJp,
      datelongmonthyear: TransformationsDate.dateLongMonthYear,
      datelonguk: TransformationsDate.dateLongUk,
      datelongus: TransformationsDate.dateLongUs,
      datelongyearmonth: TransformationsDate.dateLongYearMonth,
      datemonthday: TransformationsDate.dateMonthDay,
      datemonthdayen: TransformationsDate.dateMonthDayEn,
      datemonthdayyear: TransformationsDate.dateMonthDayYear,
      datemonthdayyearen: TransformationsDate.dateMonthDayYearEn,
      datemonthyear: TransformationsDate.dateMonthYear,
      datemonthyeardk: TransformationsDate.dateMonthYearDk,
      datemonthyearen: TransformationsDate.dateMonthYearEn,
      datemonthyearin: TransformationsDate.dateMonthYearIn,
      dateshortdaymonthuk: TransformationsDate.dateShortDayMonthUk,
      dateshorteu: TransformationsDate.dateShortEu,
      dateshortmonthdayus: TransformationsDate.dateShortMonthDayUs,
      dateshortmonthyear: TransformationsDate.dateShortMonthYear,
      dateshortuk: TransformationsDate.dateShortUk,
      dateshortus: TransformationsDate.dateShortUs,
      dateshortyearmonth: TransformationsDate.dateShortYearMonth,
      dateslashdaymontheu: TransformationsDate.dateSlashDayMonthEu,
      dateslasheu: TransformationsDate.dateSlashEu,
      dateslashmonthdayus: TransformationsDate.dateSlashMonthDayUs,
      dateslashus: TransformationsDate.dateSlashUs,
      datequarterend: TransformationsDate.dateQuarterEnd,
      dateyearmonthcjk: TransformationsDate.dateYearMonthCjk,
      dateyearmonthday: TransformationsDate.dateYearMonthDay,
      dateyearmonthdaycjk: TransformationsDate.dateYearMonthDayCjk,
      dateyearmonthen: TransformationsDate.dateYearMonthEn,
      duryear: TransformationsDate.durYear,
      durmonth: TransformationsDate.durMonth,
      durweek: TransformationsDate.durWeek,
      durday: TransformationsDate.durDay,
      durhour: TransformationsDate.durHour,
      durwordsen: TransformationsDate.durWordsEn,
      nocontent: null,
      numcomma: null,
      numcommadecimal: null,
      numcommadot: null,
      numdash: null,
      numdotcomma: null,
      numdotdecimal: TransformationsNumber.numDotDecimal,
      numdotdecimalin: null,
      numspacecomma: null,
      numspacedot: null,
      numunitdecimal: null,
      numunitdecimalin: null,
      numwordsen: TransformationsNumber.numWordsEn,
      zerodash: TransformationsNumber.zeroDash,
      "date-day-month": null,
      "date-day-monthname-bg": null,
      "date-day-monthname-cs": null,
      "date-day-monthname-da": null,
      "date-day-monthname-de": null,
      "date-day-monthname-el": null,
      "date-day-monthname-en": null,
      "date-day-monthname-es": null,
      "date-day-monthname-et": null,
      "date-day-monthname-fi": null,
      "date-day-monthname-fr": null,
      "date-day-monthname-hr": null,
      "date-day-monthname-it": null,
      "date-day-monthname-lv": null,
      "date-day-monthname-nl": null,
      "date-day-monthname-no": null,
      "date-day-monthname-pl": null,
      "date-day-monthname-pt": null,
      "date-day-monthname-ro": null,
      "date-day-monthname-sk": null,
      "date-day-monthname-sl": null,
      "date-day-monthname-sv": null,
      "date-day-monthroman": null,
      "date-day-month-year": null,
      "date-day-monthname-year-bg": null,
      "date-day-monthname-year-cs": null,
      "date-day-monthname-year-da": null,
      "date-day-monthname-year-de": null,
      "date-day-monthname-year-el": null,
      "date-day-monthname-year-en": null,
      "date-day-monthname-year-es": null,
      "date-day-monthname-year-et": null,
      "date-day-monthname-year-fi": null,
      "date-day-monthname-year-fr": null,
      "date-day-monthname-year-hi": null,
      "date-day-monthname-year-hr": null,
      "date-day-monthname-year-it": null,
      "date-day-monthname-year-nl": null,
      "date-day-monthname-year-no": null,
      "date-day-monthname-year-pl": null,
      "date-day-monthname-year-pt": null,
      "date-day-monthname-year-ro": null,
      "date-day-monthname-year-sk": null,
      "date-day-monthname-year-sl": null,
      "date-day-monthname-year-sv": null,
      "date-day-monthroman-year": null,
      "date-ind-day-monthname-year-hi": null,
      "date-jpn-era-year-month-day": null,
      "date-jpn-era-year-month": null,
      "date-monthname-day-en": null,
      "date-monthname-day-hu": null,
      "date-monthname-day-lt": null,
      "date-monthname-day-year-en": null,
      "date-month-day": null,
      "date-month-day-year": null,
      "date-month-year": null,
      "date-monthname-year-bg": null,
      "date-monthname-year-cs": null,
      "date-monthname-year-da": null,
      "date-monthname-year-de": null,
      "date-monthname-year-el": null,
      "date-monthname-year-en": null,
      "date-monthname-year-es": null,
      "date-monthname-year-et": null,
      "date-monthname-year-fi": null,
      "date-monthname-year-fr": null,
      "date-monthname-year-hi": null,
      "date-monthname-year-hr": null,
      "date-monthname-year-it": null,
      "date-monthname-year-nl": null,
      "date-monthname-year-no": null,
      "date-monthname-year-pl": null,
      "date-monthname-year-pt": null,
      "date-monthname-year-ro": null,
      "date-monthname-year-sk": null,
      "date-monthname-year-sl": null,
      "date-monthname-year-sv": null,
      "date-monthroman-year": null,
      "date-year-day-monthname-lv": null,
      "date-year-month": null,
      "date-year-month-day": null,
      "date-year-monthname-en": null,
      "date-year-monthname-hu": null,
      "date-year-monthname-day-hu": null,
      "date-year-monthname-day-lt": null,
      "date-year-monthname-lt": null,
      "date-year-monthname-lv": null,
      "fixed-empty": null,
      "fixed-false": TransformationsBoolean.fixedFalse,
      "fixed-true": TransformationsBoolean.fixedTrue,
      "fixed-zero": TransformationsNumber.fixedZero,
      "num-comma-decimal": null,
      "num-dot-decimal": TransformationsNumber.numDotDecimalTR4,
      "num-unit-decimal": null,
      "date-day-monthname-cy": null,
      "date-day-monthname-year-cy": null,
      "date-monthname-year-cy": null,
      "num-comma-decimal-apos": null,
      "num-dot-decimal-apos": null,
      "num-unit-decimal-apos": null,
    };
    if (formatArray[1]) {
      Object.keys(transformationsObject).forEach((current) => {
        if (formatArray[1]?.toLowerCase() === current) {
          if (transformationsObject[current]) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            const transformedValue = (transformationsObject[current] as Function).call(
              this,
              input
            );
            if (transformedValue.startsWith(`Format Error`)) {
              console.group(`Format Error`);
              console.error(`Error Message:`, transformedValue);
              console.info(`Fact Value:`, input);
              console.info(`Transform Value:`, current);
              console.info(`Fact ID:`, factId);
              console.groupEnd();
            }
            return transformedValue;
          } else {
            console.warn(`${current} transformation not found!`);
          }
        }
      });
    }
    return input;
  },
};
