export const TransformationsBoolean = {
  booleanFalse: () => {
    return `false`;
  },
  booleanTrue: () => {
    return `true`;
  },

  fixedTrue: () => {
    return `true`;
  },

  fixedFalse: () => {
    return `false`;
  },

  boolBallotBox: (input: string) => {
    if (input)
      switch (input.trim()) {
        case `&#x2610;`: {
          return `false`;
        }
        case `&#9744;`: {
          return `false`;
        }
        case `☐`: {
          return `false`;
        }
        case `false`: {
          return `false`;
        }
        case `&#x2611;`: {
          return `true`;
        }
        case `&#9745;`: {
          return `true`;
        }
        case `☑`: {
          return `true`;
        }
        case `&#x2612;`: {
          return `true`;
        }
        case `&#9746;`: {
          return `true`;
        }
        case `☒`: {
          return `true`;
        }
        case `true`: {
          return `true`;
        }
        default:
          return `Format Error: Bool Ballot Box`;
      }
    return `Format Error: Bool Ballot Box`;
  },

  yesNoBallotBox: function (input: string) {
    if (input)
      switch (input.trim()) {
        case `&#x2610;`: {
          return `No`;
        }
        case `&#9744;`: {
          return `No`;
        }
        case `☐`: {
          return `No`;
        }
        case `&#x2611;`: {
          return `Yes`;
        }
        case `&#9745;`: {
          return `Yes`;
        }
        case `☑`: {
          return `Yes`;
        }
        case `&#x2612;`: {
          return `Yes`;
        }
        case `&#9746;`: {
          return `Yes`;
        }
        case `☒`: {
          return `Yes`;
        }
        default:
          return `Format Error: Yes No Ballot Box`;
      }
    return `Format Error: Yes No Ballot Box`;
  },
};
