import { StoreFilter } from '../../../store/filter';
import template from './template.html';

export class Tags extends HTMLElement {
  static get observedAttributes() {
    return [`reset`];
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
    if (name === `reset` && newValue) {
      this.reset();
      this.removeAttribute(`reset`);
    }
  }

  reset() {
    const inputs = this.querySelectorAll('[name="tags-radios"]');
    (inputs[0] as HTMLInputElement).checked = true;
    this.querySelector(`.nav-link`).classList.remove(`text-warning`);
    // the event will occur in ResetAllFilters
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
    if (option > 0) {
      this.querySelector(`.nav-link`).classList.add(`text-warning`);
    } else {
      this.querySelector(`.nav-link`).classList.remove(`text-warning`);
    }
  }
}
