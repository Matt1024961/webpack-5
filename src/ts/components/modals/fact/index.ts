// import { ConstantApplication } from '../../../constants/application';
import { ConstantApplication } from '../../../constants/application';
import { getFactByID } from '../../../redux/reducers/facts';
import { FactsTable as FactsTableType } from '../../../types/facts-table';
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
    if (name === `fact-id` && newValue) {
      BaseModal.prototype.init.call(this, [
        'Company and Document',
        'Tags',
        'Files',
        'Additional Items',
      ]);
      const fact = getFactByID(newValue as string);
      console.log(fact);
      this.page1(fact as FactsTableType);
      this.page2(fact as FactsTableType);
      this.page3(fact as FactsTableType);
      this.page4(fact as FactsTableType);
      this.removeAttribute(`fact-id`);
    }
  }

  page1(fact: FactsTableType) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page1, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = Array.from(htmlDoc.querySelectorAll(`[value]`));
      valuesToGet.forEach((current) => {
        //
        if (fact[current.getAttribute(`value`) as string]) {
          const text = document.createTextNode(
            `${fact[current.getAttribute(`value`) as string]}`
          );
          current.append(text);
        } else {
          ConstantApplication.removeChildNodes(
            current.parentElement as Element
          );
        }
        current.removeAttribute(`value`);
      });
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
      }
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }

  page2(fact: FactsTableType) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page2, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = Array.from(htmlDoc.querySelectorAll(`[value]`));
      valuesToGet.forEach((current) => {
        //
        if (fact[current.getAttribute(`value`) as string]) {
          const text = document.createTextNode(
            `${fact[current.getAttribute(`value`) as string]}`
          );
          current.append(text);
        } else {
          ConstantApplication.removeChildNodes(
            current.parentElement as Element
          );
        }
        current.removeAttribute(`value`);
      });
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
      }
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }

  page3(fact: FactsTableType) {
    console.log(fact.references);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page3, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const tbody = htmlDoc.querySelector(`tbody`);
      if (fact.references) {
        for (const [key, value] of fact.references) {
          const tr = document.createElement(`tr`);
          const th = document.createElement(`th`);
          const thText = document.createTextNode(`${key}`);
          th.append(thText);
          tr.append(th);
          const td = document.createElement(`td`);
          const tdText = document.createTextNode(`${value}`);
          td.append(tdText);
          tr.append(td);
          tbody?.append(tr);
        }
      } else {
        //<tr class="reboot"><td class="reboot">No Data.</td></tr>
        const tr = document.createElement(`tr`);
        const td = document.createElement(`td`);
        const tdText = document.createTextNode(`No Data.`);
        td.append(tdText);
        tr.append(td);
        tbody?.append(tr);
      }
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
        //this.logger.info('Data Filter Bar rendered');
      }
    } else {
      //this.logger.warn('Data Filter NOT rendered');
    }
  }

  page4(fact: FactsTableType) {
    console.log(fact);
    console.log(page4);
  }
}
