import { ConstantApplication } from '../../../store/application';
// import { Logger } from 'typescript-logger';
// import Information from '../../modals/information';
import template from './template.html';

export class Menu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const textToAdd = document.createTextNode(ConstantApplication.version);
      node.querySelector(`[template-version]`).appendChild(textToAdd);
      node.removeAttribute(`template-version`);
      this.append(node);
      //this.logger.info('Data Filter Bar rendered');
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }
}
