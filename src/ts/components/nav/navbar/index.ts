import { FilingUrl } from '../../../filing-url';
import template from './template.html';

export class Navbar extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    this.render();
    new FilingUrl();
  }
  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (
      htmlDoc.querySelector(`[template]`)
    ) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      //this.logger.info('Navigation Bar rendered');
    } else {
      // this.logger.warn('Navigation Bar NOT rendered');
    }
  }
}
