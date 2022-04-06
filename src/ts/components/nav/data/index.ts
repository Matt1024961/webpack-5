import { StoreFilter } from '../../../store/filter';
import template from './template.html';

export class Data extends HTMLElement {
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
    const inputs = this.querySelectorAll('[name="data-radios"]');
    (inputs[0] as HTMLInputElement).checked = true;
    const event = new Event('change');
    inputs[0].dispatchEvent(event);
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      //this.logger.info('Data Filter Bar rendered');
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }

  listeners(): void {
    const inputs = document.querySelectorAll('[name="data-radios"]');
    if (inputs) {
      inputs.forEach((current) => {
        current.addEventListener(`change`, () => {
          this.dataOptionChange(current.getAttribute(`value`));
        });
      });
    }
  }

  dataOptionChange(input: string) {
    const option = parseInt(input, 10);
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    storeFilter.data = option;
    if (option > 0) {
      this.querySelector(`.nav-link`).classList.add(`text-warning`);
    } else {
      this.querySelector(`.nav-link`).classList.remove(`text-warning`);
    }
  }
}
