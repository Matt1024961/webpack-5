import { ConstantApplication } from '../../../constants/application';
import Database from '../../../database';
import { StoreUrl } from '../../../store/url';
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
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const db: Database = new Database(storeUrl.dataURL);
    await this.page1(db);
    await this.page2(db);
    await this.page3(db);
    await this.page4(db);
  }

  async page1(db: Database) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page1, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = htmlDoc.querySelectorAll(`[value]`);
      for await (const current of valuesToGet) {
        const factValue = (await db.getFactByTag(current.getAttribute(`value`)))
          .value;
        const text = document.createTextNode(
          `${factValue ? factValue : 'No Information.'}`
        );
        current.append(text);
        current.removeAttribute(`value`);
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

  async page2(db: Database) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page2, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      // total-facts
      const totalFactsSelector = htmlDoc.querySelector(`[total-facts]`);
      const totalFactsText = document.createTextNode(
        `${await db.getTotalFacts()}`
      );
      totalFactsSelector.append(totalFactsText);

      // inline-version
      const inlineVersionSelector = htmlDoc.querySelector(`[inline-version]`);
      const inlineVersionText = document.createTextNode(
        `${ConstantApplication.version}`
      );
      inlineVersionSelector.append(inlineVersionText);

      console.log(await db.getTotalFactsForModal());

      // const valuesToGet = htmlDoc.querySelectorAll(`[value]`);
      // for await (const current of valuesToGet) {
      //   const factValue = (await db.getFactByTag(current.getAttribute(`value`)))
      //     .value;
      //   const text = document.createTextNode(
      //     `${factValue ? factValue : 'No Information.'}`
      //   );
      //   current.append(text);
      //   current.removeAttribute(`value`);
      // }
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
  async page3(db: Database) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page3, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = htmlDoc.querySelectorAll(`[value]`);
      for await (const current of valuesToGet) {
        const factValue = (await db.getFactByTag(current.getAttribute(`value`)))
          .value;
        const text = document.createTextNode(
          `${factValue ? factValue : 'No Information.'}`
        );
        current.append(text);
        current.removeAttribute(`value`);
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

  async page4(db: Database) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page4, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const valuesToGet = htmlDoc.querySelectorAll(`[value]`);
      for await (const current of valuesToGet) {
        const factValue = (await db.getFactByTag(current.getAttribute(`value`)))
          .value;
        const text = document.createTextNode(
          `${factValue ? factValue : 'No Information.'}`
        );
        current.append(text);
        current.removeAttribute(`value`);
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
}
