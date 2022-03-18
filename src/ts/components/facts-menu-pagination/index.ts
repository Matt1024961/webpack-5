// import { Logger } from 'typescript-logger';
import { StoreData } from '../../store/data';
import { StoreUrl } from '../../store/url';
//import { facts as factsType } from '../../types/data-json';

import template from './template.html';

export class FactsMenuPagination extends HTMLElement {
  private pagination = {
    start: 0,
    end: 9,
    amount: 10,
    page: 0,
    totalPages: 0,
  };
  static get observedAttributes() {
    return [`pagination`];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    this.pagination = JSON.parse(newValue);
    this.updateTemplate();
  }

  updateTemplate() {
    // console.log(this.pagination);

    (this.querySelector(`[select-template]`) as HTMLInputElement).value =
      this.pagination.page.toString();

    if (this.pagination.page === 0) {
      this.querySelectorAll(`[prev-page], [first-page]`).forEach((current) => {
        current.parentElement.classList.add(`disabled`);
        current.parentElement.setAttribute(`disabled`, ``);
      });
    } else {
      this.querySelectorAll(`[prev-page], [first-page]`).forEach((current) => {
        current.parentElement.classList.remove(`disabled`);
        current.parentElement.removeAttribute(`disabled`);
      });
    }

    if (this.pagination.totalPages === this.pagination.page + 1) {
      this.querySelectorAll(`[next-page], [last-page]`).forEach((current) => {
        current.parentElement.classList.add(`disabled`);
        current.parentElement.setAttribute(`disabled`, ``);
      });
    } else {
      this.querySelectorAll(`[next-page], [last-page]`).forEach((current) => {
        current.parentElement.classList.remove(`disabled`);
        current.parentElement.removeAttribute(`disabled`);
      });
    }
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const storeData: StoreData = StoreData.getInstance();
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const templateInfo = storeData.getFilingFactsPaginationTemplate(
        storeUrl.filing,
        this.pagination.start,
        this.pagination.end
      );
      this.pagination.totalPages = templateInfo.totalPages;
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      Array.from(Array(templateInfo.totalPages).keys()).forEach((current) => {
        const option = document.createElement('option');
        option.value = current.toString();
        const optionText = document.createTextNode(`Page ${current + 1}`);
        option.appendChild(optionText);
        node.querySelector(`[select-template]`).appendChild(option);
      });
      // node.removeAttribute(`[select-template]`);

      this.append(node);
      this.querySelector(`sec-facts-menu-single`).setAttribute(
        `pagination`,
        JSON.stringify(this.pagination)
      );
      this.updateTemplate();
      //this.logger.info('Facts Menu rendered');
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners() {
    // const form = this.querySelector('form');
    const paginationButtons = this.querySelectorAll(
      `#facts-menu-pagination-form a`
    );

    const selectPage = this.querySelector(`[select-template]`);

    paginationButtons.forEach((current) => {
      current.addEventListener(`click`, () => {
        if (current.hasAttribute(`prev-fact`)) {
          //
          console.log(`previous fact!`);
        } else if (current.hasAttribute(`next-fact`)) {
          //
        } else if (current.hasAttribute(`first-page`)) {
          //
          this.pagination.start = 0;
          this.pagination.end = this.pagination.amount;
          this.pagination.page = 0;

          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`).setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        } else if (current.hasAttribute(`prev-page`)) {
          //
          this.pagination.start -= this.pagination.amount;
          this.pagination.end -= this.pagination.amount;
          this.pagination.page--;

          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`).setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        } else if (current.hasAttribute(`next-page`)) {
          //
          this.pagination.start += this.pagination.amount;
          this.pagination.end += this.pagination.amount;
          this.pagination.page++;

          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`).setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        } else if (current.hasAttribute(`last-page`)) {
          //
          this.pagination.start += this.pagination.amount;
          this.pagination.end += this.pagination.amount;
          this.pagination.page = this.pagination.totalPages - 1;
          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`).setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        }
      });
    });

    selectPage.addEventListener(`click`, () => {
      const newPage = parseInt((selectPage as HTMLInputElement).value);
      if (newPage !== this.pagination.page) {
        this.pagination.start += this.pagination.amount;
        this.pagination.end += this.pagination.amount;
        this.pagination.page = newPage;
        this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
        this.querySelector(`sec-facts-menu-single`).setAttribute(
          `pagination`,
          `${JSON.stringify(this.pagination)}`
        );
      }
    });
  }
}
