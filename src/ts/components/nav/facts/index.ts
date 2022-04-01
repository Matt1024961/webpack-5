import { StoreUrl } from '../../../store/url';
import { StoreData } from '../../../store/data';
import { DataJSON } from '../../../types/data-json';
import { WarningClass } from '../../../warning';
import { Attributes } from '../../../store/attributes';
import template from './template.html';

export class Facts extends HTMLElement {
  static get observedAttributes() {
    return [`data-href`];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    const storeUrl: StoreUrl = StoreUrl.getInstance();

    if (
      name === `data-href` &&
      oldValue !== newValue &&
      newValue === storeUrl.dataURL
    ) {
      if (window.Worker) {
        const worker = new Worker(
          new URL('./../../../worker/data', import.meta.url)
        );
        worker.postMessage({
          data: storeUrl.dataURL,
        });

        worker.onmessage = (event) => {
          if (event.data.dataerror) {
            const warning = new WarningClass();
            warning.show(`No supporting file was found (${storeUrl.dataURL}).`);
          }
          if (event.data.data as DataJSON) {
            const storeData: StoreData = StoreData.getInstance();
            storeData.setAllData(event.data.data);
            if (storeData.ixdsFiles.length > 1) {
              document
                .querySelector(`sec-links`)
                .setAttribute(`multiple`, `multiple`);
            }
            this.updateFactsCount(
              storeData.getFilingFacts(storeUrl.filing).length.toString()
            );
            this.enableApplication();
            const attributes = new Attributes();
            attributes.setProperAttribute();
          }
        };
      } else {
        // storeLogger.info('NOT Using a WebWorker');
      }
    }
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      //  this.logger.info('Facts Menu rendered');
    } else {
      //  this.logger.warn('Facts Menu NOT rendered');
    }
  }

  updateFactsCount(input: string) {
    const textToAdd = document.createTextNode(input);
    this.querySelector(`[template-count]`).firstElementChild.replaceWith(
      textToAdd
    );
  }

  listeners(): void {
    const offcanvas = document.querySelector('#facts-offcanvas');
    if (offcanvas) {
      const tagsToAlter = [`sec-error`, `sec-warning`, `sec-filing`];
      offcanvas.addEventListener('show.bs.offcanvas', function () {
        tagsToAlter.forEach((current) => {
          const tag = document.querySelector(current) as HTMLElement;
          Object.assign(tag.style, {
            marginRight: `400px`,
            transition: `margin 100ms`,
          });
        });
      });
      offcanvas.addEventListener('hidden.bs.offcanvas', function () {
        tagsToAlter.forEach((current) => {
          const tag = document.querySelector(current) as HTMLElement;
          Object.assign(tag.style, {
            marginRight: `0px`,
            transition: `margin 100ms`,
          });
        });
      });
    }
  }

  enableApplication(): void {
    document
      .querySelectorAll(`#navbar-container .nav-link`)
      .forEach((current) => {
        current.classList.remove(`disabled`);
      });
    document.querySelectorAll(`#global-search fieldset`).forEach((current) => {
      current.removeAttribute(`disabled`);
    });
  }
}
