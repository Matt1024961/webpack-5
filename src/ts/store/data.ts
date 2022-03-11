import { documentInfo as documentInfoType } from '../types/data-json';
import { facts as factsType } from '../types/data-json';
import { edgarRendererReports as edgarRendererReportsType } from '../types/data-json';

export class StoreData {
  private _documentInfo: documentInfoType;
  private _facts: factsType;
  private _edgarRendererReports: edgarRendererReportsType;
  // private _entity: string;
  // private _filterAxis: Array<string>;
  // private _filterBalance: Array<string>;
  // private _filterMembers: Array<string>;
  // private _filterPeriods: Array<string>;
  // private _filterScale: Array<string>;
  // private _filterUnits: Array<string>;
  // private _labels: Array<Array<string>>;
  // private _references: Array<Array<string>>;

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
    return this.facts;
  }

  public set facts(input: factsType) {
    // set up the facts for success
    this.facts = input;
  }

  public get edgarRendererReports() {
    return this.edgarRendererReports;
  }

  public set edgarRendererReports(input: edgarRendererReportsType) {
    // set up the data for success
    this.edgarRendererReports = input;
  }
}
