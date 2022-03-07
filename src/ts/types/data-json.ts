export type DataJSON = {
    documentInfo: {
      documentType: string;
      features: {
        'xbrl:conicalValues': boolean;
      };
      linkGroups: {
        ftGrp_default: string;
      };
      linkTypes: {
        'ftTyp_fact-footnote': string;
      };
      namespaces: {
        cik: string;
        clx: string;
        country: string;
        dei: string;
        invest: string;
        iso4217: string;
        ixv: string;
        srt: string;
        'us-gaap': string;
        xbrl: string;
        xbrli: string;
      };
      taxonomy: [];
    };
    facts: Array<{
      dimension: {
        concept: string;
        period: number;
      };
      id: string;
      'ixv:contextref': string;
      'ixv:factAttributes': Array<Array<string>>;
      'ixv:factCalculations': Array<string>;
      'ixv:factLabels': number;
      'ixv:files': Array<string>;
      'ixv:standardLabel': string;
      value: string;
    }>;
    'ixv:edgarRendererReports': {
      [key: string]: {
        'ixv:role': string;
        'ixv:longName': string;
        'ixv:shortName': string;
        'ixv:groupType': string;
        'ixv:subGroupType': string;
        'ixv:firstAnchor': {
          'ixv:ancestors'?: string[] | null;
          'ixv:facts'?: number[] | null;
        };
        'ixv:uniqueAnchor': {
          contextRef: string;
          name: string;
          unitRef?: null;
          xsiNil: string;
          lang?: null;
          decimals?: null;
          ancestors?: string[] | null;
          reportCount: number;
          baseRef: string;
          first: boolean;
          unique: boolean;
        };
      };
    };
    'ixv:entity': string;
    'ixv:filterAxis': Array<string>;
    'ixv:filterBalance': Array<string>;
    'ixv:filterMembers': Array<string>;
    'ixv:filterPeriods': Array<string>;
    'ixv:filterScale': Array<string>;
    'ixv:filterUnits': Array<string>;
    'ixv:labels': Array<Array<string>>;
    'ixv:references': Array<Array<string>>;
  };