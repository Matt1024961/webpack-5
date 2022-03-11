import { Logger } from 'typescript-logger';
import { Xhtml } from '../xhtml';
import { Error } from '../ui/error';
import { Warning } from '../ui/warning';

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
    // filingHost: `www.sec.gov`
    filingHost: string | null;
    // host: `www.sec.gov`
    host: string | null;
    // redline: false
    redline: boolean | null;
  } = {
    filingURL: null,
    filing: null,
    dataURL: null,
    data: `Data.json`,
    filingHost: null,
    host: window.location.origin,
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
      // report NO FILING error
      new Error(
        `#error`,
        `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`,
        false,
        this.logger
      );
      new Error(
        `#error`,
        `Inline XBRL is not usable in this state.`,
        true,
        this.logger
      );
    }
    for (const property in params) {
      if (property === `doc` || property === `file`) {
        const absoluteURLAsString = this.absoluteURL(params[property]);

        const url = new URL(absoluteURLAsString);

        this.urls.filingURL = absoluteURLAsString;

        this.urls.filing = params[property]
          .split('/')
          .slice(1)
          .pop()
          .split(`?`)[0];

        this.urls.dataURL = `${absoluteURLAsString.substring(
          0,
          absoluteURLAsString.lastIndexOf(`/`)
        )}/Data.json`;

        this.urls.filingHost = url.origin;

        this.urls.redline = params[property].indexOf(`redline=true`) >= 0;

        if (this.urls.filingHost !== this.urls.host) {
          // report CORS error
          new Error(
            `#error`,
            `The protocol, host name and port number of the "doc | file" field (${this.urls.filingHost}), if provided, must be identical to that of the Inline XBRL viewer(${this.urls.host})
            `,
            false,
            this.logger
          );
          new Error(
            `#error`,
            `Inline XBRL is not usable in this state.`,
            true,
            this.logger
          );
        } else {
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
              if (event.data.xhtmlerror) {
                new Error(
                  `#error`,
                  `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`,
                  false,
                  this.logger
                );
                new Error(
                  `#error`,
                  `Inline XBRL is not usable in this state.`,
                  true,
                  this.logger
                );
              }
              if (event.data.dataerror) {
                new Warning(
                  `#warning`,
                  `No supporting file was found (${this.urls.dataURL}).`,
                  false,
                  this.logger
                );
                new Warning(
                  `#warning`,
                  `Inline XBRL features will be minimal.`,
                  true,
                  this.logger
                );
              }
              if (event.data.xhtml) {
                // send the XHTML to be updated / fixed
                new Xhtml(params[property], event.data.xhtml, this.logger);
              }
              if (event.data.data) {
                console.log(event.data.data);
              }
            };
          } else {
            this.logger.info('NOT Using a WebWorker');
          }
        }
      } else {
        // report NO FILING error
        new Error(
          `#error`,
          `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`,
          false,
          this.logger
        );
        new Error(
          `#error`,
          `Inline XBRL is not usable in this state.`,
          true,
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

  absoluteURL(input: string): string {
    const link = document.createElement(`a`);
    link.href = input;
    return link.href;
  }
}
