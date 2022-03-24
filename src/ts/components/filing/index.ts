import { ErrorClass } from '../../error';
import { Attributes } from '../../store/attributes';
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
    //
  }

  disconnectedCallback() {
    //
  }

  adoptedCallback() {
    //
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
            const error = new ErrorClass();
            error.show(
              `Inline XBRL requires a URL param (doc | file) that correlates to a Financial Report.`
            );
            error.show(`Inline XBRL is not usable in this state.`);
          }
          if (event.data.xhtml) {
            // send the XHTML to be updated / fixed
            const xhtml = new Xhtml(storeUrl.filingURL);
            this.render(xhtml.init(event.data.xhtml));
            this.listeners();
          }
        };
      } else {
        // storeLogger.info('NOT Using a WebWorker');
      }
    }
  }

  render(xhtml: Node): void {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    this.append(xhtml);
    storeLogger.info(`Filing rendered`);
  }

  listeners() {
    const attributes = new Attributes();
    //attributes.setActiveFact();
    document.addEventListener('scroll', () => {
      attributes.setActiveFact();
    });
  }
}
