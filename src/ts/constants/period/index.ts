import moment from 'moment';

export const PeriodConstant = {
  getPeriod: (input: string) => {
    if (input.includes(`/`)) {
      const dates = input.split(`/`);
      const difference = Math.ceil(
        moment(dates[1]).diff(moment(dates[0]), 'months', true)
      );
      return `${difference} months ending ${moment(dates[0]).format(
        `MM/DD/YYYY`
      )}`;
    } else {
      return `As of ${moment(input).format(`MM/DD/YYYY`)}`;
    }
  },
};
