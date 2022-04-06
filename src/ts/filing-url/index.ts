import { ErrorClass } from '../error';
import { ConstantApplication } from '../store/application';
import { StoreData } from '../store/data';
import { StoreLogger } from '../store/logger';
import { StoreUrl } from '../store/url';
import { WarningClass } from '../warning';
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
      error.show(`Inline XBRL is not usable in this state.`);
    }

    this.findProperties(params, storeUrl);

    let filingURLLog = `Filing URL Data: `;
    Object.keys(storeUrl).forEach((current: string) => {
      filingURLLog += `\n ${current}: ${
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

        if (storeUrl.filingHost !== storeUrl.host) {
          // report CORS error
          const error = new ErrorClass();
          error.show(
            `The protocol, host name and port number of the "doc | file" field (${storeUrl.filingHost}), if provided, must be identical to that of the Inline XBRL viewer(${storeUrl.host})`
          );
          error.show(`Inline XBRL is not usable in this state.`);
        } else {
          this.beginFetch();
        }
      } else {
        // report NO FILING error
        const error = new ErrorClass();
        error.show(
          `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
        );
        error.show(`Inline XBRL is not usable in this state.`);
      }
    }
  }

  beginFetch() {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const storeUrl: StoreUrl = StoreUrl.getInstance();

    storeLogger.info(`Begin Fetch of Both XHTML and JSON on Web Worker`);

    if (window.Worker) {
      const worker = new Worker(
        new URL('./../worker/fetch/index', import.meta.url)
      );
      worker.postMessage({
        xhtml: storeUrl.filingURL,
        data: storeUrl.dataURL,
      });
      const enableapplication = { data: false, xhtml: false };
      worker.onmessage = (event) => {
        if (event.data.all) {
          if (event.data.all[1].error) {
            const warning = new WarningClass();
            warning.show(`No supporting file was found (${storeUrl.dataURL}).`);
          } else if (event.data.all[1].data) {
            const storeData: StoreData = StoreData.getInstance();
            storeData.setAllData(event.data.all[1].data);
            const factContainer = document.querySelector(
              `#facts-container sec-facts`
            );
            if (factContainer) {
              factContainer.setAttribute(`update-count`, ``);
              enableapplication.data = true;
            }
          }

          if (event.data.all[0].error) {
            const error = new ErrorClass();
            error.show(
              `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
            );
            error.show(`Inline XBRL is not usable in this state.`);
          } else if (event.data.all[0].data) {
            const filingContainer = document.querySelector(
              `#filing-container sec-filing`
            );
            if (filingContainer) {
              filingContainer.setAttribute(`xhtml`, event.data.all[0].data);
              enableapplication.xhtml = true;
            }
          }
        }
        if (enableapplication.data && enableapplication.xhtml) {
          ConstantApplication.enableApplication();
        }
      };
    }
  }
}
