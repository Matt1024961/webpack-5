// import { Logger } from 'typescript-logger';
import { StoreData } from '../../store/data';
import { StoreUrl } from '../../store/url';
//import { facts as factsType } from '../../types/data-json';

import template from './template.html';

export class FactsMenuPagination extends HTMLElement {
  private pagination = { start: 0, end: 10, amount: 10 };
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
    // this.empty();
    //this.render();
  }

  empty() {
    this.innerHTML = ``;
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

      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);

      if (templateInfo.currentPage === 0) {
        node
          .querySelectorAll(`[prev-page], [first-page]`)
          .forEach((current) => {
            current.classList.add(`disabled`);
            current.setAttribute(`disabled`, `true`);
          });
      }
      if (templateInfo.totalPages === templateInfo.currentPage) {
        node
          .querySelectorAll(`[next-page], [last-page]`)
          .forEach((current) => {
            current.classList.add(`disabled`);
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
      this.querySelector(`sec-facts-menu-single`).setAttribute(`pagination`, JSON.stringify(this.pagination));
      //this.logger.info('Facts Menu rendered');
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners() {
    const form = this.querySelector('form');
    const paginationButtons = this.querySelectorAll(`#facts-menu-pagination-form a`);
    form.addEventListener('change', (event) => {
      event.preventDefault();
      console.log((event.target as Element).getAttributeNames())
      const attributes = (event.target as Element).getAttributeNames();
      if (attributes.includes(`checked`)) {
        console.log(`un-check!`);
      }
      if (attributes.includes(`prev-button`)) {
        console.log(`previous!`);
      }
      if (attributes.includes(`next-button`)) {
        console.log(`next!!`);
      }
      if (attributes.includes(`first-button`)) {
        console.log(`first!!`);
      }
      if (attributes.includes(`last-button`)) {
        console.log(`last!!`);
      }
      console.log(`done changed!`);
    });

    paginationButtons.forEach((current) => {
      current.addEventListener(`click`, () => {
        if (current.hasAttribute(`prev-fact`)) {
          //
          console.log(`previous fact!`);
        } else if (current.hasAttribute(`next-fact`)) {
          //
        } else if (current.hasAttribute(`first-page`)) {
          //
        } else if (current.hasAttribute(`prev-page`)) {
          //
          this.pagination.start -= this.pagination.amount;
          this.pagination.end -= this.pagination.amount;
          this.querySelector(`sec-facts-menu-single`).setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
        } else if (current.hasAttribute(`next-page`)) {
          //
          this.pagination.start += this.pagination.amount;
          this.pagination.end += this.pagination.amount;
          this.querySelector(`sec-facts-menu-single`).setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
        } else if (current.hasAttribute(`last-page`)) {
          //
        }
      });
    });
  }
}
