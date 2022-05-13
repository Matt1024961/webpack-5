// import { ConstantApplication } from '../../../constants/application';
import FactsTable from '../../../indexedDB/facts';
import { StoreUrl } from '../../../store/url';

import template from './template.html';

export class SectionsMenuSingle extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.render();
    this.listeners();
  }

  empty() {
    this.innerHTML = ``;
  }

  async render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      // get all sections data
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const db: FactsTable = new FactsTable(storeUrl.dataURL);

      await db.getAllSectionsData();
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners() {
    const facts = this.querySelectorAll(`[fact-id]`);

    facts.forEach((current) => {
      current.addEventListener(`click`, () => {
        this.querySelectorAll(`[fact-id]`).forEach((nestedCurrent) => {
          nestedCurrent.classList.remove(`selected`);
        });
        current.classList.add(`selected`);
        const modal = document.createElement(`sec-modal-fact`);
        modal.setAttribute(`fact-id`, current.getAttribute(`fact-id`));
        document.querySelector(`#modal-container`).append(modal);
      });
    });
  }
}
