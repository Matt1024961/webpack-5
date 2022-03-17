// import { Logger } from 'typescript-logger';
import { StoreData } from '../../store/data';
import { StoreUrl } from '../../store/url';
//import { facts as factsType } from '../../types/data-json';

import template from './template.html';

export class FactsMenuPagination extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const storeData: StoreData = StoreData.getInstance();
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const templateInfo = storeData.getFilingFactsPaginationTemplate(
        storeUrl.filing,
        0,
        10
      );

      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);

      if (templateInfo.currentPage === 0) {
        node
          .querySelectorAll(`[prev-button], [first-button]`)
          .forEach((current) => {
            current.setAttribute(`disabled`, `true`);
          });
      }
      console.log(templateInfo);
      if (templateInfo.totalPages === templateInfo.currentPage) {
        node
          .querySelectorAll(`[next-button], [last-button]`)
          .forEach((current) => {
            current.setAttribute(`disabled`, `true`);
          });
      }

      Array.from(Array(templateInfo.totalPages).keys()).forEach((current) => {
        const option = document.createElement('option');
        const optionText = document.createTextNode(`Page ${current + 1}`);
        option.appendChild(optionText);
        node.querySelector(`[select-template]`).appendChild(option);
      });
      node.removeAttribute(`[select-template]`);

      this.append(node);
      //this.logger.info('Facts Menu rendered');
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners() {
    const form = this.querySelector('form');

    form.addEventListener('change', () => {
      console.log(`done changed!`);
    });
    //   const facts = this.querySelectorAll(`[fact-id]`);
    //   const storeData: StoreData = StoreData.getInstance();
    //   facts.forEach((current) => {
    //     current.addEventListener(`click`, () => {
    //       const fact = storeData.getFactByID(current.getAttribute(`fact-id`));
    //       if (fact && document.querySelector(fact.id)) {
    //         document.querySelector(fact.id).scrollIntoView();
    //       } else {
    //         this.showWarning(`This Fact can not be found on this Filing!`);
    //       }
    //     });
    //   });
  }

  // showError(message: string): void {
  //   const error = document.createElement(`sec-error`);
  //   error.setAttribute(`message`, message);
  //   document.querySelector(`#error-container`).appendChild(error);
  // }

  // showWarning(message: string) {
  //   const warning = document.createElement(`sec-warning`);
  //   warning.setAttribute(`message`, message);
  //   document.querySelector(`#warning-container`).appendChild(warning);
  // }
}
