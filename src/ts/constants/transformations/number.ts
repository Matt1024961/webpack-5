export const TransformationsNumber = {
  numDotDecimalTR4: (input: string) => {
    return TransformationsNumber.simpleFormatting(input);
  },
  simpleFormatting: (input: string) => {
    return input.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  },
};
