// import { ConstantApplication } from '../../../constants/application';
// import FactsTable from '../../../indexedDB/facts';
import SectionsTable from '../../../indexedDB/sections';
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
      const db: SectionsTable = new SectionsTable(storeUrl.dataURL);
      const sections = this.simplifySectionsData(await db.getSections());

      const selector = htmlDoc.querySelector(`[template]`);
      //const node = document.importNode(selector, true);
      Object.keys(sections).forEach((current, index) => {
        const node = document.importNode(selector, true);

        console.log(current, index, sections[current].length);
        const title = document.createTextNode(current)
        node.querySelector(`[section-title]`).append(title);

        const count = document.createTextNode(`${sections[current].length}`);
        node.querySelector(`[section-count]`).append(count);

        node.removeAttribute(`template`);
        this.append(node);
      });

      // node.removeAttribute(`template`);
      // this.append(node);
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  simplifySectionsData(input: any[]) {

    return input.reduce((accumulator: { [key: string]: Array<string> }, current) => {
      if (Object.prototype.hasOwnProperty.call(accumulator, current.groupType)) {
        accumulator[current.groupType].push(current);
      } else {
        accumulator[current.groupType] = [];
        accumulator[current.groupType].push(current);
      }
      return accumulator;
    }, {});
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
