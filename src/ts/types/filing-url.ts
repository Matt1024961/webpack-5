export type FilingURL = {
  id: number;
  // baseURL: `http://localhost:3000/assets/example-4/`
  baseURL: string | null;
  // fullURL: 'http://localhost:3000/?doc=/assets/example-4/clx-20210630.htm'
  fullURL: string | null;
  // filingURL: `/assets/example-1/fy19clx10k.htm`
  filingURL: string | null;
  //filing: `fy19clx10k.htm`
  filing: string | null;
  // dataURL: `/assets/example-1/Data.json`
  dataURL: string | null;
  // data: `Data.json`
  data: string;
  // filingHost: `www.sec.gov`
  filingHost: string | null;
  // host: `www.sec.gov`
  host: string | null;
  // redline: false
  redline: boolean | null;
};
