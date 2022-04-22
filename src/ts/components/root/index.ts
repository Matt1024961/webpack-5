import { StoreLogger } from '../../store/logger';
import template from './template.html';

export class Root extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // console.log(`disconnectedCallback`);
  }

  adoptedCallback() {
    // console.log(`adoptedCallback`);
  }

  attributeChangedCallback() {
    // console.log(`attributeChangedCallback`);
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
      storeLogger.info('Root Application rendered');
    } else {
      storeLogger.error('Root Application NOT rendered');
    }
  }
}
