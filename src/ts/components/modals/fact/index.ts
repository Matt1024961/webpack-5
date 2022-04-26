//import * as bootstrap from 'bootstrap';

import { ConstantApplication } from '../../../constants/application';
import Database from '../../../database';
import { StoreUrl } from '../../../store/url';
import { FactsTable } from '../../../types/facts-table';
import { BaseModal } from '../base-modal';
import page1 from './template-page-1.html';
import page2 from './template-page-2.html';
import page3 from './template-page-3.html';
import page4 from './template-page-4.html';

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
    BaseModal.prototype.init.call(this, [
      'Company and Document',
      'Tags',
      'Files',
      'Additional Items',
    ]);

    this.buildCarousel(newValue);
  }

  async buildCarousel(factId: string) {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const db: Database = new Database(storeUrl.dataURL);
    const fact = await db.getFactById(factId);
    await this.page1(fact);
    await this.page2(fact);
    await this.page3(fact);
    //await this.page4(fact);
  }

  async page1(fact: FactsTable) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page1, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = htmlDoc.querySelectorAll(`[value]`);
      for await (const current of valuesToGet) {
        if (
          fact[current.getAttribute(`value`)] &&
          fact[current.getAttribute(`value`)].length
        ) {
          const text = document.createTextNode(
            `${fact[current.getAttribute(`value`)]}`
          );
          current.append(text);
          current.removeAttribute(`value`);
        } else {
          ConstantApplication.removeChildNodes(current.parentElement);
        }
      }
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const carousel = this.querySelector(`[carousel-items]`);
      carousel.append(node);
      //this.logger.info('Data Filter Bar rendered');
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }
  async page2(fact: FactsTable) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page2, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const tbody = htmlDoc.querySelector(`tbody`);
      for await (const [key, value] of fact.labels as Array<Array<string>>) {
        const tr = document.createElement(`tr`);
        const th = document.createElement(`th`);
        const thText = document.createTextNode(`${key}`);
        th.append(thText);
        tr.append(th);
        const td = document.createElement(`td`);
        const tdText = document.createTextNode(`${value}`);
        td.append(tdText);
        tr.append(td);
        tbody.append(tr);
      }
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const carousel = this.querySelector(`[carousel-items]`);
      carousel.append(node);
      //this.logger.info('Data Filter Bar rendered');
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }

  async page3(fact: FactsTable) {
    console.log(page3);
    console.log(fact.references);
  }
  async page4(fact: FactsTable) {
    console.log(fact);
    console.log(page4);
  }
}
