import * as bootstrap from 'bootstrap';
import template from './template.html';

export class BaseModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  render() {
    console.log(`what?`);
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
    const thisModal = new bootstrap.Modal(this.querySelector(`#sec-modal`), {
      backdrop: `static`,
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
