import * as bootstrap from 'bootstrap';
import { StoreLogger } from '../../../store/logger';
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
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      storeLogger.info('Base Modal rendered');
    } else {
      storeLogger.error('Base Modal NOT rendered');
    }
  }

  listeners() {

    this.querySelector(`#sec-modal`).addEventListener(`show.bs.modal`, () => {
      console.log(`dis!`);
      console.log(document.querySelector(`body`));
      document.querySelector(`body`).style.removeProperty(`overflow`);
      document.querySelector(`body`).style.removeProperty(`padding-right`);
    });

    const thisModal = new bootstrap.Modal(this.querySelector(`#sec-modal`), {
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
