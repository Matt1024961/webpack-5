import { ConstantApplication } from '../../constants/application';
import { PeriodConstant } from '../../constants/period';
import { TransformationsConstant } from '../../constants/transformations';
import { DataJSON } from '../../types/data-json';
import { FormInformationTable } from '../../types/form-information';
import { SectionsTable } from '../../types/sections-table';

const fetchXhtml = async (url: string) => {
  return fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.text();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then((data) => {
      return { data };
    })
    .catch((error) => {
      return { error };
    });
};

const fetchData = async (url: string, xhtmlUrl: string) => {
  //const factsTable: FactsTable = new FactsTable(url);
  // const sectionsTable: SectionsTable = new SectionsTable(url);
  return fetch(url)
    .then(async (response) => {
      if (response.status >= 200 && response.status <= 299) {
        //await sectionsTable.clearSectionsTable();
        // await factsTable.clearFactsTable();
        return response.json();
      } else {
        throw Error(response.status.toString());
      }
    })
    .then(async (data: DataJSON) => {
      return prepareDataForStore(data, xhtmlUrl);
      // await sectionsTable.parseSectionsData(data);
      // return await factsTable.parseFactData(data, xhtmlUrl)
      return data;
    })
    .catch((error) => {
      return { error };
    });
};

self.onmessage = async ({ data }) => {
  if (data.data && data.xhtml) {
    await Promise.all([
      fetchXhtml(data.xhtml),
      fetchData(data.data, data.xhtml),
    ]).then(async (allResponses) => {
      self.postMessage({
        all: allResponses,
      });
    });
  } else if (data.xhtml) {
    await Promise.all([fetchXhtml(data.xhtml)]).then(async (allResponses) => {
      self.postMessage({
        all: allResponses,
      });
    });
  }
};
function prepareDataForStore(data: DataJSON, xhtmlUrl: string): any {
  const returnObject: { facts: Array<any>; sections: Array<any>; info: FormInformationTable | any } = {
    facts: [],
    sections: [],
    info: {},
    // info: {}
  };

  returnObject.facts = fillFacts(data, xhtmlUrl);
  returnObject.sections = fillSections(data);
  returnObject.info = fillFormInfo(data);
  return returnObject;
}

function fillFacts(input: DataJSON, xhtmlUrl: string): Array<any> {
  const arrayToBulkInsert: Array<any> = [];
  const customTags = Object.keys(input['ixv:extensionNamespaces']);
  for (const current of input.facts) {
    const tempDimension: {
      key?: Array<string | number>;
      value?: Array<string | number>;
    } = {};
    // eslint-disable-next-line no-prototype-builtins
    if (current.hasOwnProperty(`dimensions`)) {
      const dimensions = { ...current.dimensions };
      delete dimensions.concept;
      delete dimensions.period;
      delete dimensions.unit;
      delete dimensions.language;
      const dimensionValues = Object.values(dimensions);
      if (dimensionValues.length) {
        tempDimension.value = dimensionValues;
      }
      const dimensionKeys = Object.keys(dimensions);
      if (dimensionKeys.length) {
        tempDimension.key = dimensionKeys;
      }
    }
    if (current['ixv:factAttributes']) {
      let orderCount = 0;
      const factToPutIntoDB = {
        // everything located in ixv:factAttributes
        tag: current['ixv:factAttributes'][0][1],
        isHtml: current['ixv:factAttributes'][2][1] ? 1 : 0,
        period: PeriodConstant.getPeriod(
          input['ixv:filterPeriods'][current['ixv:factAttributes'][3][1]]
        ),
        axes: current['ixv:factAttributes'][4][1].length
          ? current['ixv:factAttributes'][4][1]
          : null,
        members: current['ixv:factAttributes'][5][1].length
          ? current['ixv:factAttributes'][5][1]
          : null,
        measure: current['ixv:factAttributes'][6][1],
        scale: current['ixv:factAttributes'][7][1]
          ? parseInt(current['ixv:factAttributes'][7][1], 10)
          : null,
        decimals: current['ixv:factAttributes'][8][1],
        balance: current['ixv:factAttributes'][9][1],
        // END everything located in ixv:factAttributes

        id: current.id,
        value: TransformationsConstant.getTransformation(
          current.value,
          current.decimals,
          current['ixv:format']
        ),
        dimensions:
          tempDimension.value && tempDimension.key
            ? {
              concept: current.dimensions.concept,
              period: current.dimensions.period,
              lang: current.dimensions.language,
              unit: current.dimensions.unit,
              value: tempDimension.value,
              key: tempDimension.key,
            }
            : null,
        references: input['ixv:references'][current['ixv:factReferences']],
        contextref: current['ixv:contextref'],
        isHidden: current['ixv:hidden'] ? 1 : 0,
        standardLabel: current['ixv:standardLabel'],
        labels: input['ixv:labels'][current['ixv:factLabels']],
        calculations: current['ixv:factCalculations'][1],
        isNegative: current['ixv:isnegativesonly'] ? 1 : 0,
        isNumeric: current['ixv:isnumeric'] ? 1 : 0,
        isText: current['ixv:istextonly'] ? 1 : 0,
        isCustom: customTags.includes(
          current[`ixv:factAttributes`][0][1].substr(
            0,
            current[`ixv:factAttributes`][0][1].indexOf(`:`)
          )
        )
          ? 1
          : 0,
        files: current[`ixv:files`]
          ? input['ixv:ixdsFiles'][current[`ixv:files`]]
          : xhtmlUrl,
        order: orderCount++,
        isHighlight: false,
        isActive: true,
      };
      arrayToBulkInsert.push(factToPutIntoDB);
    } else {
      // todo figure out what to do with these?
      // console.log(current.value);
    }
  }
  return arrayToBulkInsert;
}

const fillSections = (input: DataJSON) => {
  const arrayToBulkInsert: Array<SectionsTable> = [];
  let count = 0;
  for (const current of input['ixv:edgarRendererReports']) {
    let groupType: string | null = ``;
    switch (current[`ixv:groupType`]) {
      case `document`: {
        groupType = `Document & Entity Information`;
        break;
      }
      case `statement`: {
        groupType = `Financial Statements`;
        break;
      }
      case `disclosure`: {
        groupType = `Notes to the Financial Statements`;
        break;
      }
      case `RR_Summaries`: {
        groupType = `RR Summaries`;
        break;
      }
      default: {
        groupType = null;
      }
    }
    const contextRef = current[`ixv:uniqueAnchor`]
      ? current[`ixv:uniqueAnchor`][`contextRef`]
      : null;
    const name = current[`ixv:uniqueAnchor`]
      ? current[`ixv:uniqueAnchor`][`name`]
      : null;
    const sectionToPutIntoDB: SectionsTable = {
      id: count++,
      reportFile: current['ixv:reportFile'],
      longName: current[`ixv:longName`],
      shortName: current[`ixv:shortName`],
      groupType: groupType,
      subGroup: current[`ixv:subGroupType`],
      baseRef: current[`ixv:uniqueAnchor`]
        ? current[`ixv:uniqueAnchor`][`baseRef`]
        : null,
      contextRef: contextRef,
      name: name,
      isActive: true,
    };
    if (sectionToPutIntoDB.groupType) {
      arrayToBulkInsert.push(sectionToPutIntoDB);
    }
  }
  return arrayToBulkInsert;
};

const fillFormInfo = (input: DataJSON) => {
  return {
    id: 1,

    totalFacts: input.facts.length,
    version: ConstantApplication.version,

    primary: {
      standard: input[`ixv:instanceInfo`].keyStandard,
      standardPerc: `${Math.round(
        (input[`ixv:instanceInfo`].keyStandard / (input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].keyCustom)
        ) * 100)}%`,
      custom: input[`ixv:instanceInfo`].keyCustom,
      customPerc: `${Math.round(
        (input[`ixv:instanceInfo`].keyCustom /
          (input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].keyCustom)
        ) * 100)}%`,
      total: input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].keyCustom,
    },

    axis: {
      standard: input[`ixv:instanceInfo`].axisStandard,
      standardPerc: `${Math.round(
        input[`ixv:instanceInfo`].axisStandard /
        (input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].axisCustom)
        * 100)}%`,
      custom: input[`ixv:instanceInfo`].axisCustom,
      customPerc: `${Math.round(
        input[`ixv:instanceInfo`].axisCustom /
        (input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].axisCustom)
        * 100)}%`,
      total: input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].axisCustom,
    },

    member: {
      standard: input[`ixv:instanceInfo`].memberStandard,
      standardPerc: `${Math.round(
        input[`ixv:instanceInfo`].memberStandard /
        (input[`ixv:instanceInfo`].memberStandard + input[`ixv:instanceInfo`].memberCustom)
        * 100)}%`,
      custom: input[`ixv:instanceInfo`].memberCustom,
      customPerc: `${Math.round(
        input[`ixv:instanceInfo`].memberCustom /
        (input[`ixv:instanceInfo`].memberStandard + input[`ixv:instanceInfo`].memberCustom)
        * 100)}%`,
      total: input[`ixv:instanceInfo`].memberStandard + input[`ixv:instanceInfo`].memberCustom,
    },

    total: {
      standard: input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].memberStandard,
      standardPerc: `${Math.round(
        (input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].memberStandard) /
        (input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].keyCustom + input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].axisCustom + input[`ixv:instanceInfo`].memberStandard + input[`ixv:instanceInfo`].memberCustom)
        * 100)}%`,
      custom: input[`ixv:instanceInfo`].keyCustom + input[`ixv:instanceInfo`].axisCustom + input[`ixv:instanceInfo`].memberCustom,
      customPerc: `${Math.round(
        (input[`ixv:instanceInfo`].keyCustom + input[`ixv:instanceInfo`].axisCustom + input[`ixv:instanceInfo`].memberCustom) /
        (input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].keyCustom + input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].axisCustom + input[`ixv:instanceInfo`].memberStandard + input[`ixv:instanceInfo`].memberCustom)
        * 100)}%`,
      total: input[`ixv:instanceInfo`].keyStandard + input[`ixv:instanceInfo`].keyCustom + input[`ixv:instanceInfo`].axisStandard + input[`ixv:instanceInfo`].axisCustom + input[`ixv:instanceInfo`].memberStandard + input[`ixv:instanceInfo`].memberCustom,
    },


    inlineDocument: input[`ixv:instanceInfo`].dts.inline.local,

    schema: input[`ixv:instanceInfo`].dts.schema.local.concat(input[`ixv:instanceInfo`].dts.schema.remote),

    label: input[`ixv:instanceInfo`].dts.labelLink.local,

    calculation: input[`ixv:instanceInfo`].dts.calculationLink.local,

    presentation: input[`ixv:instanceInfo`].dts.presentationLink.local,

    definition: input[`ixv:instanceInfo`].dts.definitionLink.local,

    taxonomy: input[`ixv:instanceInfo`].hidden,
  };
}
