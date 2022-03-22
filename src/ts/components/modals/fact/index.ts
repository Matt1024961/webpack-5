import * as bootstrap from 'bootstrap';
import { Logger } from 'typescript-logger';
import template from './template.html';

export class Fact extends HTMLElement {
  private logger: Logger;
  static get observedAttributes() {
    return [`fact-id`];
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
    console.log(newValue);
    document.querySelector(`#${newValue}`).scrollIntoView();
    // this.pagination = JSON.parse(newValue);
    // this.empty();
    // this.render();
    // this.listeners();
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

  listeners() {
    const thisModal = new bootstrap.Modal(this.querySelector(`#fact-modal`), {
      backdrop: false,
      keyboard: true,
    });
    thisModal.show();

    this.querySelector(`#dialog-box-close`).addEventListener(`click`, () => {
      thisModal.hide();
      document.querySelectorAll(`[fact-id]`).forEach((nestedCurrent) => {
        nestedCurrent.classList.remove(`selected`);
      });
    });
  }
}
