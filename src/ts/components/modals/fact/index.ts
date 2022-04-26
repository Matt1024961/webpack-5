//import * as bootstrap from 'bootstrap';
import { BaseModal } from '../base-modal';
import template from './template.html';

export class Fact extends BaseModal {
  static get observedAttributes() {
    return [`fact-id`];
  }

  constructor() {
    super();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    BaseModal.prototype.render.call(this);
    BaseModal.prototype.listeners.call(this, [`Attributes`, `Labels`, `References`, `Calculation`]);
    document.querySelector(`#${newValue}`).scrollIntoView();
    this.render();
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

}
