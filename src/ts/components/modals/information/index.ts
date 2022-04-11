import { StoreLogger } from '../../../store/logger';
import { BaseModal } from '../base-modal';
import template from './template.html';

export class Information extends BaseModal {
  constructor() {
    super();
  }

  connectedCallback() {
    BaseModal.prototype.render.call(this);
    BaseModal.prototype.listeners.call(this);
    // this.render();
    // this.listeners();
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
