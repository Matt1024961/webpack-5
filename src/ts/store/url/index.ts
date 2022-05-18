export class StoreUrl {
  private _filingURL!: string | null;

  //filing: `fy19clx10k.htm`
  private _filing!: string | null;

  // dataURL: `/assets/example-1/Data.json`
  private _dataURL!: string | null;

  // data: `Data.json`
  private _data = `Data.json`;

  // filingHost: `www.sec.gov`
  private _filingHost!: string | null;

  // host: `www.sec.gov`
  private _host!: string | null;

  // redline: false
  private _redline: boolean | null = false;

  private _baseURL!: string | null;
  private _fullURL!: string | null;
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

  public get baseURL() {
    return this._baseURL as string;
  }

  public set baseURL(input: string) {
    this._baseURL = input;
  }

  public get fullURL() {
    return this._fullURL as string;
  }

  public set fullURL(input: string) {
    this._fullURL = input;
  }

  public get filingURL() {
    return this._filingURL as string;
  }

  public set filingURL(input: string) {
    const src = `${input.substring(0, input.lastIndexOf('/'))}/`;
    this._baseURL = src;
    this._filingURL = input;
  }

  public get filing() {
    return this._filing as string;
  }

  public set filing(input: string) {
    this._filing = input;
  }

  public get dataURL() {
    return this._dataURL as string;
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
    return this._filingHost as string;
  }

  public set filingHost(input: string) {
    this._filingHost = input;
  }

  public get host() {
    return this._host as string;
  }

  public set host(input: string) {
    this._host = input;
  }

  public get redline() {
    return this._redline as boolean;
  }

  public set redline(input: boolean) {
    this._redline = input;
  }
}
