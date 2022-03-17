export type FilingURL = {
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
