import { StoreFilter } from '../../../store/filter';
import template from './template.html';

export class ResetAllFilters extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        this.append(node);
        // this.logger.info('Tags Filter Bar rendered');
      }
    } else {
      // this.logger.warn('Tags Filter NOT rendered');
    }
  }

  listeners(): void {
    const button = this.querySelector('.nav-link');
    if (button) {
      button.addEventListener(`click`, (event) => {
        event.preventDefault();
        this.resetAllFilters();
      });
    }
  }

  resetAllFilters() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    document.querySelector(`sec-data`)?.setAttribute(`reset`, `true`);
    document.querySelector(`sec-tags`)?.setAttribute(`reset`, `true`);
    document.querySelector(`sec-more-filters`)?.setAttribute(`reset`, `true`);
    document
      .querySelector(`sec-facts-menu-pagination`)
      ?.setAttribute(`reset`, `true`);
    storeFilter.resetAllFilters();
  }
}
