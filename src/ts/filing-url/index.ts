import { ErrorClass } from '../error';
import { ConstantApplication } from '../constants/application';
import { StoreLogger } from '../../logger';
import { StoreXhtml } from '../xhtml';
import { WarningClass } from '../warning';
// import { StoreFilter } from '../store/filter';
import store from '../redux';
import {
  actions as factActions,
  getMultiFiling,
} from '../redux/reducers/facts';

import { actions as sectionsActions } from '../redux/reducers/sections';
import { actions as urlActions, getURLs } from '../redux/reducers/url';
import { actions as infoActions } from '../redux/reducers/form-information';
import { FilingURL } from '../types/filing-url';

export class FilingUrl {
  public filingUrlcallback: (() => void) | undefined;
  constructor(input = ``, callback?: (() => void) | undefined) {
    if (input) {
      this.filingUrlcallback = callback;
      this.changeFiling(input);
    } else {
      this.init();
    }
  }

  init(): void {
    const storeLogger: StoreLogger = StoreLogger.getInstance();

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

    this.findProperties(params);

    let filingURLLog = `Filing URL Data: `;
    const urls = getURLs() as FilingURL;
    Object.keys(urls).forEach((current: string) => {
      filingURLLog += `\n\t ${current}: ${urls[current as keyof typeof urls]}`;
    });
    storeLogger.info(filingURLLog);
    storeLogger.info(`Filing URL Complete`);
  }

  changeFiling(input: string): void {
    const urls = getURLs() as FilingURL;
    const updatedURL = {
      id: 1,
      fullURL: (urls.fullURL as string).replace(urls.filing as string, input),
      filing: input,
      filingURL:
        (urls.filingURL as string).split(`/`).slice(0, -1).join(`/`) +
        `/${input}`,
    };
    store.dispatch(urlActions.upsert(updatedURL as FilingURL));
    this.beginPartialFetch();
  }

  absoluteURL(input: string): string {
    const link = document.createElement(`a`);
    link.href = input;
    return link.href;
  }

  findProperties(params: { [x: string]: string }) {
    let urlStore: FilingURL | null = null;
    for (const property in params) {
      if (property === `doc` || property === `file`) {
        const absoluteURLAsString = this.absoluteURL(params[property]);
        const url = new URL(absoluteURLAsString);

        urlStore = {
          id: 1,
          filingURL: absoluteURLAsString,
          filing: params[property]
            .split('/')
            .slice(1)
            .pop()
            ?.split(`?`)[0] as string,
          dataURL: `${absoluteURLAsString.substring(
            0,
            absoluteURLAsString.lastIndexOf(`/`)
          )}/Data.json`,
          data: `Data.json`,
          filingHost: url.origin,
          host: window.location.origin,
          redline: params[property].indexOf(`redline=true`) >= 0,
          fullURL: window.location.href,
          baseURL: `${absoluteURLAsString.substring(
            0,
            absoluteURLAsString.lastIndexOf('/')
          )}/`,
        };

        if (urlStore.filingHost !== urlStore.host) {
          // report CORS error
          const error = new ErrorClass();
          error.show(
            `The protocol, host name and port number of the "doc | file" field (${urlStore.filingHost}), if provided, must be identical to that of the Inline XBRL viewer(${urlStore.host})`
          );
          error.show(`Inline XBRL is not usable in this state.`, true);
        } else {
          store.dispatch(urlActions.init(urlStore as FilingURL));
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
    const urls = getURLs() as FilingURL;
    storeLogger.info(`Begin Fetch of Both XHTML and JSON on Web Worker`);
    if (window.Worker) {
      const start = performance.now();
      const worker = new Worker(
        new URL('./../worker/fetch/index.ts', import.meta.url),
        { name: `fetch` }
      );

      worker.postMessage({
        xhtml: urls.filingURL,
        data: urls.dataURL,
      });
      const enableapplication = { data: false, xhtml: false };
      worker.onmessage = async (event) => {
        store.dispatch(factActions.factsAddMany(event.data.all[1].facts));

        store.dispatch(
          sectionsActions.sectionsAddMany(event.data.all[1].sections)
        );

        store.dispatch(infoActions.infoInit(event.data.all[1].info));

        if (event.data.all) {
          if (event.data.all[1].error) {
            const warning = new WarningClass();
            warning.show(`No supporting file was found (${urls.dataURL}).`);
          } else if (event.data.all[1]) {

            if (getMultiFiling().length > 1) {
              const links = document.querySelector(`sec-links`);
              if (links) {
                links.classList.remove(`d-none`);
                links.setAttribute(`multiple`, ``);
              }
            }
            const factContainer = document.querySelector(`sec-facts`);
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

  beginPartialFetch() {
    this.resetApplication();
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const urls = getURLs() as FilingURL;
    storeLogger.info(`Begin Fetch of XHTML on Web Worker`);
    if (window.Worker) {
      //const start = performance.now();
      const worker = new Worker(
        new URL('./../worker/fetch/index.ts', import.meta.url),
        { name: `fetch` }
      );

      worker.postMessage({
        xhtml: urls.filingURL,
      });
      worker.onmessage = async (event) => {
        if (event.data.all) {
          if (event.data.all[0].error) {
            const error = new ErrorClass();
            error.show(
              `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
            );
            error.show(`Inline XBRL is not usable in this state.`, true);
          } else {
            // successfully have the XHTML file
            const storeXhtml: StoreXhtml = StoreXhtml.getInstance();
            // const storeFilter: StoreFilter = StoreFilter.getInstance();
            // storeFilter.filterFacts();
            storeXhtml.node = event.data.all[0].data;
            const filingContainer = document.querySelector(
              `#filing-container sec-filing`
            );
            const linksContainer = document.querySelector(
              `#navbar-container sec-links`
            );
            const sectionsContainer = document.querySelector(
              `sec-sections-menu-single`
            );

            if (linksContainer) {
              linksContainer.setAttribute(`update`, `true`);
            }
            if (filingContainer) {
              filingContainer.setAttribute(`update`, `true`);
            }
            if (sectionsContainer) {
              sectionsContainer.setAttribute(`update`, `true`);
            }
            ConstantApplication.enableApplication();
            window.history.pushState(
              `Next Link`,
              `Inline XBRL Viewer`,
              urls.fullURL
            );
            if (this.filingUrlcallback) {
              this.filingUrlcallback();
            }
          }
        }
      };
    }
  }

  resetApplication() {
    ConstantApplication.disableApplication();
    const filingContainer = document.querySelector(
      `#filing-container sec-filing`
    );
    if (filingContainer) {
      filingContainer.setAttribute(`reset`, `true`);
    }
  }
}
