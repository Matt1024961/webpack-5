import { Tooltip } from 'bootstrap';
import { StoreLogger } from '../../store/logger';
import template from './template.html';

export class Warning extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const textToAdd = document.createTextNode(this.getAttribute(`message`));
      node.querySelector(`[warning-text]`).appendChild(textToAdd);
      node.removeAttribute(`warning-text`);
      this.append(node);
      storeLogger.info(`Warning Banner rendered`);
    } else {
      storeLogger.warn(`Warning Banner NOT rendered`);
    }
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
      (tooltipTriggerEl: Element) => {
        new Tooltip(tooltipTriggerEl);
      }
    );
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
