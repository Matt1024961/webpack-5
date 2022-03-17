import { StoreLogger } from '../store/logger';
import { StoreUrl } from '../store/url';
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
      this.showError(
        `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
      );
      this.showError(`Inline XBRL is not usable in this state.`);
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
          this.showError(
            `The protocol, host name and port number of the "doc | file" field (${storeUrl.filingHost}), if provided, must be identical to that of the Inline XBRL viewer(${storeUrl.host})`
          );
          this.showError(`Inline XBRL is not usable in this state.`);
        } else {
          const filingContainer = document.querySelector(
            `#filing-container sec-filing`
          );
          if (filingContainer) {
            filingContainer.setAttribute(`filing-href`, storeUrl.filingURL);
          }
          const factContainer = document.querySelector(
            `#facts-container sec-facts`
          );
          if (factContainer) {
            factContainer.setAttribute(`data-href`, storeUrl.dataURL);
          } else {
            console.log(`nonononohnonoonono`);
          }
        }
      } else {
        // report NO FILING error
        this.showError(
          `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
        );
        this.showError(`Inline XBRL is not usable in this state.`);
      }
    }
  }

  showError(message: string): void {
    const error = document.createElement(`sec-error`);
    error.setAttribute(`message`, message);
    document.querySelector(`#error-container`).appendChild(error);
  }

  showWarning(message: string) {
    const warning = document.createElement(`sec-warning`);
    warning.setAttribute(`message`, message);
    document.querySelector(`#warning-container`).appendChild(warning);
  }
}
