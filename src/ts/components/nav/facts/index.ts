//import Database from '../../../database';
import { TransformationsNumber } from '../../../constants/transformations/number';
import { StoreFilter } from '../../../store/filter';
//import { StoreUrl } from '../../../store/url';
import template from './template.html';

export class Facts extends HTMLElement {
  static get observedAttributes() {
    return [`update-count`, `loading`, `reset`];
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
    if (name === `update-count` && newValue === ``) {
      this.updateFactsCount();
      document
        .querySelector(`sec-facts-menu-pagination`)
        ?.setAttribute(`reset`, `true`);
      this.removeAttribute(`update-count`);
    }

    if (name === `loading` && newValue === ``) {
      this.updateFactsLoading();
      this.removeAttribute(`loading`);
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

  updateFactsLoading() {
    const icon = document.createElement(`i`);
    icon.classList.add(`fa-solid`);
    icon.classList.add(`fa-spinner`);
    icon.classList.add(`fa-spin`);

    this.querySelector(`[template-count]`).firstElementChild.replaceWith(icon);
  }

  async updateFactsCount() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();

    const factCount = storeFilter.getFactsCount();
    const textToAdd = document.createTextNode(
      `${TransformationsNumber.simpleFormatting(factCount.toString())}`
    );
    const span = document.createElement(`span`);

    span.append(textToAdd);

    this.querySelector(`[template-count]`).firstElementChild.replaceWith(span);
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
}
