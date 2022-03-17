export class StoreUrl {
  private _filingURL: string | null;
  //filing: `fy19clx10k.htm`
  private _filing: string | null;
  // dataURL: `/assets/example-1/Data.json`
  private _dataURL: string | null;
  // data: `Data.json`
  private _data = `Data.json`;
  // filingHost: `www.sec.gov`
  private _filingHost: string | null;
  // host: `www.sec.gov`
  private _host = window.location.origin;
  // redline: false
  private _redline: boolean | null;
  private static instance: StoreUrl;

  private constructor() {
    //
  }

  public static getInstance(): StoreUrl {
    if (!StoreUrl.instance) {
      StoreUrl.instance = new StoreUrl();
    }
    return StoreUrl.instance;
  }

  public get filingURL() {
    return this._filingURL;
  }

  public set filingURL(input: string) {
    this._filingURL = input;
  }

  public get filing() {
    return this._filing;
  }

  public set filing(input: string) {
    this._filing = input;
  }

  public get dataURL() {
    return this._dataURL;
  }

  public set dataURL(input: string) {
    this._dataURL = input;
  }

  public get data() {
    return this._data;
  }

  public set data(input: string) {
    this._data = input;
  }

  public get filingHost() {
    return this._filingHost;
  }

  public set filingHost(input: string) {
    this._filingHost = input;
  }

  public get host() {
    return this._host;
  }

  public set host(input: string) {
    this.host = input;
  }

  public get redline() {
    return this._redline;
  }

  public set redline(input: boolean) {
    this._redline = input;
  }
}
