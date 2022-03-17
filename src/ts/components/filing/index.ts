import { StoreLogger } from '../../store/logger';
import { StoreUrl } from '../../store/url';
import { Xhtml } from '../../xhtml';

export class Filing extends HTMLElement {
  static get observedAttributes() {
    return [`filing-href`];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    console.log(`connectedCallback`);
  }

  disconnectedCallback() {
    console.log(`disconnectedCallback`);
  }

  adoptedCallback() {
    console.log(`adoptedCallback`);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    if (
      name === `filing-href` &&
      oldValue !== newValue &&
      newValue === storeUrl.filingURL
    ) {
      if (window.Worker) {
        const worker = new Worker(
          new URL('./../../worker/xhtml', import.meta.url)
        );
        worker.postMessage({
          xhtml: storeUrl.filingURL,
        });

        worker.onmessage = (event) => {
          if (event.data.xhtmlerror) {
            this.showError(
              `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
            );
            this.showError(`Inline XBRL is not usable in this state.`);
          }
          if (event.data.xhtml) {
            // send the XHTML to be updated / fixed
            const xhtml = new Xhtml(storeUrl.filingURL);
            this.render(xhtml.init(event.data.xhtml));
          }
        };
      } else {
        // storeLogger.info('NOT Using a WebWorker');
      }
    }
  }

  render(xhtml: Node): void {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    storeLogger.info(`Filing rendered`);
    this.append(xhtml);
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
