//import { ConstantApplication } from '../../../constants/application';
//import { FactsTable as FactsTableType } from '../../../types/facts-table';
import { getFactByTag } from '../../../redux/reducers/facts';
import { getFormInformation } from '../../../redux/reducers/form-information';
import { FormInformationTable } from '../../../types/form-information';
import { BaseModal } from '../base-modal';
import page1 from './template-page-1.html';
import page2 from './template-page-2.html';
import page3 from './template-page-3.html';
import page4 from './template-page-4.html';
export class Information extends BaseModal {
  constructor() {
    super();
  }

  connectedCallback() {
    BaseModal.prototype.init.call(this, [
      'Company and Document',
      'Tags',
      'Files',
      'Additional Items',
    ]);

    this.buildCarousel();
  }

  async buildCarousel() {
    const data = getFormInformation() as FormInformationTable;
    this.page1();
    this.page2(data);
    this.page3(data);
    this.page4(data);
  }

  page1() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page1, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = Array.from(htmlDoc.querySelectorAll(`[value]`));
      valuesToGet.forEach((current) => {
        const factValue = getFactByTag(current.getAttribute(`value`) as string)[0]?.value;
        const text = document.createTextNode(
          `${factValue ? factValue : 'No Information.'}`
        );
        current.append(text);
        current.removeAttribute(`value`);
      });
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
        //this.logger.info('Data Filter Bar rendered');
      }
    }
  }

  page2(input: FormInformationTable) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page2, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = Array.from(htmlDoc.querySelectorAll(`[value]`));
      valuesToGet.forEach((current) => {
        if (current.getAttribute(`value`)?.includes(`.`)) {
          const valueArray = (current.getAttribute(`value`) as string).split(`.`);
          const value = input[valueArray[0]][valueArray[1]];
          const text = document.createTextNode(
            `${value ? value : 'No Information.'}`
          );
          current.append(text);
        } else {
          const value = input[current.getAttribute(`value`) as string];
          const text = document.createTextNode(
            `${value ? value : 'No Information.'}`
          );
          current.append(text);
        }
        current.removeAttribute(`value`);
      });
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
        //this.logger.info('Data Filter Bar rendered');
      }
    }
  }

  page3(input: FormInformationTable) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page3, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = Array.from(htmlDoc.querySelectorAll(`[value]`));
      valuesToGet.forEach((current) => {
        const value = input[current.getAttribute(`value`) as string];
        if (Array.isArray(value)) {
          value.forEach((currentValue: string, index) => {
            if (index === 0) {
              const text = document.createTextNode(
                `${currentValue ? currentValue : 'No Information.'}`
              );
              current.append(text);
            } else {
              const tr = document.createElement(`tr`);
              const th = document.createElement(`th`);
              const td = document.createElement(`td`);
              const text = document.createTextNode(
                `${currentValue ? currentValue : 'No Information.'}`
              );
              td.append(text);
              tr.append(th);
              tr.append(td);
              current.parentElement?.after(tr);
            }
          });
        }
        current.removeAttribute(`value`);
      });
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
        //this.logger.info('Data Filter Bar rendered');
      }
    }
  }

  page4(input: FormInformationTable) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page4, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const container = htmlDoc.querySelector(`[multiple]`);
      Object.keys(input.taxonomy).forEach((current) => {
        const tr = document.createElement(`tr`);

        const th = document.createElement(`th`);
        th.classList.add(`text-capitalize`);
        const thText = document.createTextNode(current);
        th.append(thText);
        tr.append(th);

        const td = document.createElement(`td`);
        const tdText = document.createTextNode(input.taxonomy[current]);
        td.append(tdText);
        tr.append(td);

        container?.append(tr);
      });
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
        //this.logger.info('Data Filter Bar rendered');
      }
    }
  }
}
