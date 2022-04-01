import { StoreFilter } from '../../../store/filter';
import template from './template.html';

export class Tags extends HTMLElement {
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
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      // this.logger.info('Tags Filter Bar rendered');
    } else {
      // this.logger.warn('Tags Filter NOT rendered');
    }
  }

  listeners(): void {
    const radios = document.querySelectorAll('[name="tags-radios"]');
    if (radios) {
      radios.forEach((current) => {
        current.addEventListener(`change`, () => {
          this.tagOptionChange(current.getAttribute(`value`));
        });
      });
    }
  }
  
  tagOptionChange(input: string) {
    const option = parseInt(input, 10);
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    storeFilter.tags = option;
  }

}
