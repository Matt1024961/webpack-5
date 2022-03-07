import { Logger } from 'typescript-logger';
import { Xhtml } from '../xhtml';
import { Error } from '../error';

export class FilingUrl {
  private logger: Logger;
  private urls: {
    // filingURL: `/assets/example-1/fy19clx10k.htm`
    filingURL: string | null;
    //filing: `fy19clx10k.htm`
    filing: string | null;
    // dataURL: `/assets/example-1/Data.json`
    dataURL: string | null;
    // data: `Data.json`
    data: string;
    // host: `www.sec.gov`
    host: string;
    // redline: false
    redline: boolean | null;
  } = {
    filingURL: null,
    filing: null,
    dataURL: null,
    data: `Data.json`,
    host: window.location.hostname,
    redline: null,
  };
  constructor(logger: Logger) {
    this.logger = logger;
    this.init();
  }

  init(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (Object.keys(params).length === 0) {
      // report error
      new Error(
        `#error`,
        `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`,
        this.logger
      );
    }
    for (const property in params) {
      if (property === `doc` || property === `file`) {
        this.urls.filingURL = params[property].split(`?`)[0];
        this.urls.filing = params[property]
          .split('/')
          .slice(1)
          .pop()
          .split(`?`)[0];

        this.urls.dataURL = `${params[property].substring(
          0,
          params[property].lastIndexOf(`/`)
        )}/Data.json`;
        this.urls.redline = params[property].indexOf(`redline=true`) >= 0;
        if (window.Worker) {
          this.logger.info('Using a WebWorker');
          const worker = new Worker(
            new URL('./../worker/index', import.meta.url)
          );
          worker.postMessage({
            xhtml: params[property],
            data: `${params[property].substring(
              0,
              params[property].lastIndexOf(`/`)
            )}/Data.json`,
          });

          worker.onmessage = (event) => {
            if (event.data.xhtml) {
              // send the XHTML to be updated / fixed
              new Xhtml(params[property], event.data.xhtml, this.logger);
            }
            if (event.data.data) {
              // console.log(event.data.data);
            }
          };
        } else {
          this.logger.info('NOT Using a WebWorker');
        }
      } else {
        // report error
        new Error(
          `#error`,
          `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`,
          this.logger
        );
      }
    }
    let filingURLLog = `Filing URL Data: `;
    Object.keys(this.urls).forEach((current: string) => {
      filingURLLog += `\n ${current}: ${
        this.urls[current as keyof typeof this.urls]
      }`;
    });
    this.logger.info(filingURLLog);
    this.logger.info('Filing URL Complete');
  }
}
