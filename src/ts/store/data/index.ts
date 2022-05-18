import moment from 'moment';
import { documentInfo as documentInfoType } from '../../types/data-json';
import { facts as factsType } from '../../types/data-json';
import { edgarRendererReports as edgarRendererReportsType } from '../../types/data-json';
import { entity as entityType } from '../../types/data-json';

import { filterAxis as filterAxisType } from '../../types/data-json';
import { filterBalance as filterBalanceType } from '../../types/data-json';
import { filterMembers as filterMembersType } from '../../types/data-json';
import { filterPeriods as filterPeriodsType } from '../../types/data-json';
import { filterScale as filterScaleType } from '../../types/data-json';
import { filterUnits as filterUnitsType } from '../../types/data-json';
import { labels as labelsType } from '../../types/data-json';
import { references as referencesType } from '../../types/data-json';
import { ixdsFiles as ixdsFilesType } from '../../types/data-json';

export class StoreData {
  private _documentInfo!: documentInfoType;
  private _facts!: Array<factsType>;
  private _edgarRendererReports!: edgarRendererReportsType;
  private _entity!: entityType;
  private _filterAxis!: filterAxisType;
  private _filterBalance!: filterBalanceType;
  private _filterMembers!: filterMembersType;
  private _filterPeriods!: filterPeriodsType;
  private _filterScale!: filterScaleType;
  private _filterUnits!: filterUnitsType;
  private _labels!: labelsType;
  private _references!: referencesType;
  private _simplePeriods!: Array<{ value: number; text: string; }>;
  private _complexPeriods!: {
    [key: string]: Array<{ value: number; text: string; }>;
  };
  private _ixdsFiles!: ixdsFilesType;
  private _ixvExtensionNamespaces!: { [key: string]: string; };

  private static instance: StoreData;

  private constructor() {
    //
  }

  public static getInstance(): StoreData {
    if (!StoreData.instance) {
      StoreData.instance = new StoreData();
    }
    return StoreData.instance;
  }

  public setFilingFactsActive(input: Array<string>) {
    return this._facts.forEach((element) => {
      if (input.includes(element.id)) {
        element.active = true;
      } else {
        element.active = false;
      }
    });
  }

  public setFilingFactsHighlight(input: Array<string>) {
    return this._facts.forEach((element) => {
      if (input.includes(element.id)) {
        element.highlight = true;
      } else {
        element.highlight = false;
      }
    });
  }

  public getFactByID(input: string) {
    return this._facts.find((element) => {
      return element.id === input;
    });
  }

  getFactValueByName(input: string) {
    return this._facts.find((element) => {
      return element[`ixv:factAttributes`][0][1] === input;
    });
  }

  public getIsCustomTag(input: factsType): boolean {
    return input[`ixv:factAttributes`][0][1].startsWith(`clx:`);
  }

  public getIsDimension(input: factsType): boolean {
    return Object.prototype.hasOwnProperty.call(input, `dimensions`);
  }

  public getIsAdditional(input: factsType): boolean {
    // eslint-disable-next-line no-prototype-builtins
    return input.hasOwnProperty(`dimensions`);
  }

  public getSimplePeriod(input: number) {
    return this._simplePeriods[input];
  }

  public get documentInfo() {
    return this._documentInfo;
  }

  public set documentInfo(input: documentInfoType) {
    this._documentInfo = input;
  }

  public get facts() {
    return this._facts;
  }

  public set facts(input: Array<factsType>) {
    // set up the data for success
    input.forEach((current) => {
      current.active = true;
      current.highlight = false;
    });
    this._facts = input;
  }

  public get edgarRendererReports() {
    return this._edgarRendererReports;
  }

  public set edgarRendererReports(input: edgarRendererReportsType) {
    // set up the data for success
    this._edgarRendererReports = input;
  }

  public get entity() {
    return this._entity;
  }

  public set entity(input: entityType) {
    // set up the data for success
    this._entity = input;
  }

  public get filterAxis() {
    return this._filterAxis;
  }

  public set filterAxis(input: filterAxisType) {
    // set up the data for success
    this._filterAxis = input;
  }

  public get filterBalance() {
    return this._filterBalance;
  }

  public set filterBalance(input: filterBalanceType) {
    // set up the data for success
    this._filterBalance = input;
  }

  public get filterMembers() {
    return this._filterMembers;
  }

  public set filterMembers(input: filterMembersType) {
    // set up the data for success
    this._filterMembers = input;
  }

  public get filterPeriods() {
    return this._filterPeriods;
  }

  public set filterPeriods(input: filterPeriodsType) {
    // set up the data for success

    const complexPeriods: {
      [key: string]: Array<{ value: number; text: string }>;
    } = {};

    const simplePeriods: Array<{ value: number; text: string }> = [];
    input.forEach((current, index) => {
      if (current.includes(`/`)) {
        const dates = current.split(`/`);
        const difference = Math.ceil(
          moment(dates[1]).diff(moment(dates[0]), 'months', true)
        );
        simplePeriods[index] = {
          value: index,
          text: `${difference} months ending ${moment(dates[0]).format(
            `MM/DD/YYYY`
          )}`,
        };
        const year = moment(dates[0]).format(`YYYY`);
        // eslint-disable-next-line no-prototype-builtins
        if (!complexPeriods.hasOwnProperty(year)) {
          complexPeriods[year] = [
            {
              value: index,
              text: `${difference} months ending ${moment(dates[0]).format(
                `MM/DD/YYYY`
              )}`,
            },
          ];
        } else {
          complexPeriods[year].push({
            value: index,
            text: `${difference} months ending ${moment(dates[0]).format(
              `MM/DD/YYYY`
            )}`,
          });
        }
      } else {
        simplePeriods[index] = {
          value: index,
          text: `As of ${moment(current).format(`MM/DD/YYYY`)}`,
        };
        const year = moment(current).format(`YYYY`);
        // eslint-disable-next-line no-prototype-builtins
        if (!complexPeriods.hasOwnProperty(year)) {
          complexPeriods[year] = [
            {
              value: index,
              text: `As of ${moment(current).format(`MM/DD/YYYY`)}`,
            },
          ];
        } else {
          complexPeriods[year].push({
            value: index,
            text: `As of ${moment(current).format(`MM/DD/YYYY`)}`,
          });
        }
      }
    });
    this._complexPeriods = complexPeriods;
    this._simplePeriods = simplePeriods;
    this._filterPeriods = input;
  }

  public get simplePeriods() {
    return this._simplePeriods;
  }

  public get complexPeriods() {
    return this._complexPeriods;
  }

  public get filterScale() {
    return this._filterScale;
  }

  public set filterScale(input: filterScaleType) {
    // set up the data for success
    this._filterScale = input;
  }

  public get filterUnits() {
    return this._filterUnits;
  }

  public set filterUnits(input: filterUnitsType) {
    // set up the data for success
    this._filterUnits = input;
  }

  public get labels() {
    return this._labels;
  }

  public set labels(input: labelsType) {
    // set up the data for success
    this._labels = input;
  }

  public get references() {
    return this._references;
  }

  public set references(input: referencesType) {
    // set up the data for success
    this._references = input;
  }

  public set ixdsFiles(input: ixdsFilesType) {
    this._ixdsFiles = input;
  }

  public get ixdsFiles() {
    return this._ixdsFiles;
  }

  public set ixvExtensionNamespaces(input: { [key: string]: string }) {
    this._ixvExtensionNamespaces = input;
  }

  public get ixvExtensionNamespaces() {
    return this._ixvExtensionNamespaces;
  }
}
