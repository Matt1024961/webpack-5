export type DataJSON = {
  documentInfo: documentInfo;
  facts: Array<facts>;
  'ixv:edgarRendererReports': edgarRendererReports;
  'ixv:entity': entity;
  'ixv:filterAxis': filterAxis;
  'ixv:filterBalance': filterBalance;
  'ixv:filterMembers': filterMembers;
  'ixv:filterPeriods': filterPeriods;
  'ixv:filterScale': filterScale;
  'ixv:filterUnits': filterUnits;
  'ixv:labels': labels;
  'ixv:references': references;
  'ixv:ixdsFiles': ixdsFiles;
};

export type documentInfo = {
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

export type facts = {
  dimensions: {
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
  'ixv:hidden': boolean;
  value: string;
  active: null | boolean;
};

export type edgarRendererReports = {
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

export type entity = string;

export type filterAxis = Array<string>;

export type filterBalance = Array<string>;

export type filterMembers = Array<string>;

export type filterPeriods = Array<string>;

export type filterScale = Array<string>;

export type filterUnits = Array<string>;

export type labels = Array<Array<string>>;

export type references = Array<Array<string>>;

export type ixdsFiles = Array<string>;
