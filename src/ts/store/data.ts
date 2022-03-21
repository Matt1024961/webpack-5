import * as moment from 'moment';
import { DataJSON } from '../types/data-json';
import { documentInfo as documentInfoType } from '../types/data-json';

import { facts as factsType } from '../types/data-json';
import { edgarRendererReports as edgarRendererReportsType } from '../types/data-json';
import { entity as entityType } from '../types/data-json';

import { filterAxis as filterAxisType } from '../types/data-json';
import { filterBalance as filterBalanceType } from '../types/data-json';
import { filterMembers as filterMembersType } from '../types/data-json';
import { filterPeriods as filterPeriodsType } from '../types/data-json';
import { filterScale as filterScaleType } from '../types/data-json';
import { filterUnits as filterUnitsType } from '../types/data-json';
import { labels as labelsType } from '../types/data-json';
import { references as referencesType } from '../types/data-json';

export class StoreData {
  private _documentInfo: documentInfoType;
  private _facts: Array<factsType>;
  private _edgarRendererReports: edgarRendererReportsType;
  private _entity: entityType;
  private _filterAxis: filterAxisType;
  private _filterBalance: filterBalanceType;
  private _filterMembers: filterMembersType;
  private _filterPeriods: filterPeriodsType;
  private _filterScale: filterScaleType;
  private _filterUnits: filterUnitsType;
  private _labels: labelsType;
  private _references: referencesType;
  private _simplePeriods: Array<string>;

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

  public getFilingFacts(input: string) {
    return this._facts
      .map((current) => {
        if (current[`active`] && current[`ixv:files`] && current[`ixv:files`].includes(input)) {
          return current;
        }
      })
      .filter(Boolean);
  }

  public getFilingFactsPaginationTemplate(
    input: string,
    start: number,
    end: number,
    amount = 10
  ) {
    const factsForThisInput = this.getFilingFacts(input).length;

    return {
      total: factsForThisInput,
      start: start,
      end: end,
      totalPages: Math.ceil(factsForThisInput / amount),
      currentPage: start * amount,
    };
  }

  public getFilingFactsPagination(input: string, start: number, end: number) {
    return this.getFilingFacts(input).slice(start, end + 1);
  }

  public getFactByID(input: string) {
    return this._facts.find((element) => {
      return element.id === input;
    });
  }

  public getIsCustomTag(input: factsType): boolean {
    // console.log(input[`ixv:factAttributes`][0][1]);
    return input[`ixv:factAttributes`][0][1].startsWith(`clx:`);
  }

  public getIsDimension(input: factsType): boolean {
    return Object.prototype.hasOwnProperty.call(input, `dimensions`);
  }

  public getIsAdditional(input: factsType): boolean {
    //console.log(input);
    // eslint-disable-next-line no-prototype-builtins
    return input.hasOwnProperty(`dimensions`);
  }

  public setAllData(input: DataJSON) {
    this.edgarRendererReports = input['ixv:edgarRendererReports'];
    this.entity = input['ixv:entity'];
    this.filterAxis = input['ixv:filterAxis'];
    this.filterBalance = input['ixv:filterBalance'];
    this.filterMembers = input['ixv:filterMembers'];
    this.filterPeriods = input['ixv:filterPeriods'];
    this.filterScale = input['ixv:filterScale'];
    this.filterUnits = input['ixv:filterUnits'];
    this.labels = input['ixv:labels'];
    this.references = input['ixv:references'];
    this.facts = input.facts;
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
      current[`active`] = true;
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
    const simplePeriods: Array<string> = [];
    input.forEach((current, index) => {
      if (current.includes(`/`)) {
        const dates = current.split(`/`);
        const difference = Math.ceil(
          moment(dates[1]).diff(moment(dates[0]), 'months', true)
        );
        simplePeriods[index] = `${difference} months ending ${moment(
          dates[0]
        ).format(`MM/DD/YYYY`)}`;
      } else {
        simplePeriods[index] = `As of ${moment(current).format(`MM/DD/YYYY`)}`;
      }
    });
    this._simplePeriods = simplePeriods;
    //console.log(periods);
    this._filterPeriods = input;
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
}
