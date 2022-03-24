import { StoreLogger } from '../../store/logger';
import template from './template.html';

export class Error extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const textToAdd = document.createTextNode(this.getAttribute(`message`));
      node.querySelector(`[error-text]`).appendChild(textToAdd);
      node.removeAttribute(`error-text`);
      this.append(node);
      storeLogger.info(`Error Banner rendered`);
    } else {
      storeLogger.warn(`Error Banner NOT rendered`);
    }
  }

  disableApplication(): void {
    document.querySelectorAll(`#navbar .nav-link`).forEach((current) => {
      current.classList.add(`disabled`);
    });
    document.querySelectorAll(`#global-search fieldset`).forEach((current) => {
      current.setAttribute(`disabled`, `true`);
    });
  }
}
