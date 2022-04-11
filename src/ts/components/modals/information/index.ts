import { StoreLogger } from '../../../store/logger';
import template from './template.html';

export class Information extends HTMLElement {
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
      storeLogger.info('Information Modal rendered');
    } else {
      storeLogger.error('Information Modal NOT rendered');
    }
  }

  listeners() {
    //
  }
}
