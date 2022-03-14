import * as moment from 'moment';

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
  private _facts: factsType;
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

  public get documentInfo() {
    return this._documentInfo;
  }

  public set documentInfo(input: documentInfoType) {
    this._documentInfo = input;
  }

  public get facts() {
    return this._facts;
  }

  public set facts(input: factsType) {
    // set up the data for success
    //console.log(input);
    // input.forEach((current) => {
    //   console.log(current);
    // });
    // console.log(input.length);
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
    const periods: { [key: string]: Array<string> } = {};
    input.forEach((current) => {
      if (current.includes(`/`)) {
        const dates = current.split(`/`);
        const difference = Math.ceil(
          moment(dates[1]).diff(moment(dates[0]), 'months', true)
        );
        const year = moment(dates[0]).format(`YYYY`);
        if (periods && !Object.prototype.hasOwnProperty.call(year, 'key')) {
          periods[year] = [
            `${difference} months ending ${moment(dates[0]).format(
              `MM/DD/YYYY`
            )}`,
          ];
        } else {
          periods[year].push(
            `${difference} months ending ${moment(dates[0]).format(
              `MM/DD/YYYY`
            )}`
          );
        }
      } else {
        const year = moment(current).format(`YYYY`);
        if (periods && !Object.prototype.hasOwnProperty.call(year, 'key')) {
          periods[year] = [`As of ${moment(current).format(`MM/DD/YYYY`)}`];
        } else {
          periods[year].push(`As of ${moment(current).format(`MM/DD/YYYY`)}`);
        }
      }
    });
    console.log(periods);
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