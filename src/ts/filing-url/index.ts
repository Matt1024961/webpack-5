import { ErrorClass } from '../error';
import { ConstantApplication } from '../constants/application';
import { StoreLogger } from '../store/logger';
import { StoreUrl } from '../store/url';
import { StoreXhtml } from '../store/xhtml';
import { WarningClass } from '../warning';
import { StoreFilter } from '../store/filter';
import Database from '../database';
export class FilingUrl {
  constructor() {
    this.init();
  }

  init(): void {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const storeUrl: StoreUrl = StoreUrl.getInstance();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (Object.keys(params).length === 0) {
      // report NO FILING error
      const error = new ErrorClass();
      error.show(
        `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
      );
      error.show(`Inline XBRL is not usable in this state.`, true);
    }

    this.findProperties(params, storeUrl);

    let filingURLLog = `Filing URL Data: `;
    Object.keys(storeUrl).forEach((current: string) => {
      filingURLLog += `\n\t ${current}: ${
        storeUrl[current as keyof typeof storeUrl]
      }`;
    });
    storeLogger.info(filingURLLog);
    storeLogger.info(`Filing URL Complete`);
  }

  absoluteURL(input: string): string {
    const link = document.createElement(`a`);
    link.href = input;
    return link.href;
  }

  findProperties(params: { [x: string]: string }, storeUrl: StoreUrl) {
    for (const property in params) {
      if (property === `doc` || property === `file`) {
        const absoluteURLAsString = this.absoluteURL(params[property]);

        const url = new URL(absoluteURLAsString);

        storeUrl.filingURL = absoluteURLAsString;

        storeUrl.filing = params[property]
          .split('/')
          .slice(1)
          .pop()
          .split(`?`)[0];

        storeUrl.dataURL = `${absoluteURLAsString.substring(
          0,
          absoluteURLAsString.lastIndexOf(`/`)
        )}/${storeUrl.data}`;

        storeUrl.filingHost = url.origin;

        storeUrl.redline = params[property].indexOf(`redline=true`) >= 0;

        storeUrl.host = window.location.origin;

        if (storeUrl.filingHost !== storeUrl.host) {
          // report CORS error
          const error = new ErrorClass();
          error.show(
            `The protocol, host name and port number of the "doc | file" field (${storeUrl.filingHost}), if provided, must be identical to that of the Inline XBRL viewer(${storeUrl.host})`
          );
          error.show(`Inline XBRL is not usable in this state.`, true);
        } else {
          this.beginFetch();
        }
      } else {
        // report NO FILING error
        const error = new ErrorClass();
        error.show(
          `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
        );
        error.show(`Inline XBRL is not usable in this state.`, true);
      }
    }
  }

  beginFetch() {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const storeUrl: StoreUrl = StoreUrl.getInstance();

    storeLogger.info(`Begin Fetch of Both XHTML and JSON on Web Worker`);

    if (window.Worker) {
      const start = performance.now();
      const worker = new Worker(
        new URL('./../worker/fetch/index.ts', import.meta.url),
        { name: `fetch` }
      );

      worker.postMessage({
        xhtml: storeUrl.filingURL,
        data: storeUrl.dataURL,
      });
      const enableapplication = { data: false, xhtml: false };
      worker.onmessage = async (event) => {
        if (event.data.all) {
          if (event.data.all[1].error) {
            const warning = new WarningClass();
            warning.show(`No supporting file was found (${storeUrl.dataURL}).`);
          } else if (event.data.all[1]) {
            const storeFilter: StoreFilter = StoreFilter.getInstance();
            storeFilter.active = event.data.all[1].active;
            storeFilter.highlight = event.data.all[1].highlight;

            const factContainer = document.querySelector(
              `#facts-container sec-facts`
            );
            if (factContainer) {
              factContainer.setAttribute(`update-count`, ``);
              enableapplication.data = true;
            }

            const storeUrl: StoreUrl = StoreUrl.getInstance();
            const db: Database = new Database(storeUrl.dataURL);
            if (((await db.isMultiFiling()) as Array<string>).length) {
              const links = document.querySelector(`sec-links`);
              if (links) {
                links.classList.remove(`d-none`);
                links.setAttribute(`multiple`, ``);
              }
            }
          }

          if (event.data.all[0].error) {
            const error = new ErrorClass();
            error.show(
              `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
            );
            error.show(`Inline XBRL is not usable in this state.`, true);
          } else if (event.data.all[0].data) {
            const storeXhtml: StoreXhtml = StoreXhtml.getInstance();
            storeXhtml.node = event.data.all[0].data;
            const filingContainer = document.querySelector(
              `#filing-container sec-filing`
            );
            if (filingContainer) {
              filingContainer.setAttribute(`update`, `true`);
              enableapplication.xhtml = true;
            }
          }
        }
        if (enableapplication.data && enableapplication.xhtml) {
          ConstantApplication.enableApplication();
        }
        const stop = performance.now();
        const storeLogger: StoreLogger = StoreLogger.getInstance();
        storeLogger.info(
          `Fetching Necessary Filings AND Loading IndexedDB took ${(
            stop - start
          ).toFixed(2)} milliseconds.`
        );
        worker.terminate();
      };
    } else {
      // no worker!
    }
  }
}
