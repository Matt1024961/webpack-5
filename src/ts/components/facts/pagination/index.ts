import { ConstantApplication } from '../../../constants/application';
import { StoreFilter } from '../../../store/filter';
import { StoreUrl } from '../../../store/url';

import template from './template.html';

export class FactsMenuPagination extends HTMLElement {
  private pagination = ConstantApplication.factMenuPagination;
  static get observedAttributes() {
    return [`pagination`, `reset`];
  }
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.render();
    this.listeners();
  }

  async attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === `pagination`) {
      if (newValue) {
        this.pagination = JSON.parse(newValue);
        this.updateTemplate();
      }
    }
    if (name === `reset` && newValue) {
      this.innerHTML = ``;
      this.pagination = ConstantApplication.factMenuPagination;
      await this.render();
      this.listeners();
      this.removeAttribute(`reset`);
    }
  }

  updateTemplate() {
    (this.querySelector(`[select-template]`) as HTMLInputElement).value =
      this.pagination.page.toString();

    if (this.pagination.page === 0) {
      this.querySelectorAll(`[prev-page], [first-page]`).forEach((current) => {
        current.parentElement?.classList.add(`disabled`);
        current.parentElement?.setAttribute(`disabled`, ``);
      });
    } else {
      this.querySelectorAll(`[prev-page], [first-page]`).forEach((current) => {
        current.parentElement?.classList.remove(`disabled`);
        current.parentElement?.removeAttribute(`disabled`);
      });
    }

    if (this.pagination.totalPages === this.pagination.page + 1) {
      this.querySelectorAll(`[next-page], [last-page]`).forEach((current) => {
        current.parentElement?.classList.add(`disabled`);
        current.parentElement?.setAttribute(`disabled`, ``);
      });
    } else {
      this.querySelectorAll(`[next-page], [last-page]`).forEach((current) => {
        current.parentElement?.classList.remove(`disabled`);
        current.parentElement?.removeAttribute(`disabled`);
      });
    }
  }

  async render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const storeFilter: StoreFilter = StoreFilter.getInstance();
      const templateInfo = await storeFilter.getFactPaginationData(
        storeUrl.filing,
        this.pagination.start,
        this.pagination.end,
        this.pagination.amount
      );
      this.pagination.totalPages = templateInfo.totalPages;
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        Array.from(Array(templateInfo.totalPages).keys()).forEach((current) => {
          const option = document.createElement('option');
          option.value = current.toString();
          const optionText = document.createTextNode(`Page ${current + 1}`);
          option.appendChild(optionText);
          node.querySelector(`[select-template]`)?.appendChild(option);
        });
        this.append(node);

        this.querySelector(`sec-facts-menu-single`)?.setAttribute(
          `pagination`,
          JSON.stringify(this.pagination)
        );
        this.updateTemplate();
        //this.logger.info('Facts Menu rendered');
      }
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
          console.log(`next fact`);
          const currentlySelected =
            document.querySelector(`[fact-id].selected`);
          if (currentlySelected) {
            if (currentlySelected.nextSibling) {
              console.log(currentlySelected.nextSibling);
              (currentlySelected.nextSibling as HTMLElement).classList.add(
                `selected`
              );
            } else {
              //
            }
            //  console.log((currentlySelected.nextSibling as HTMLElement).classList.add(`selected`));
          } else {
            console.log(document.querySelector(`[fact-id]`)?.classList);
            document.querySelector(`[fact-id]`)?.classList.add(`selected`);
          }
          // document.querySelectorAll(`[fact-id]`).forEach((nestedCurrent) => {
          //   nestedCurrent.classList.remove(`selected`);
          // });
          // current.classList.add(`selected`);
        } else if (current.hasAttribute(`first-page`)) {
          //
          this.pagination.start = 0;
          this.pagination.end = this.pagination.amount;
          this.pagination.page = 0;

          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`)?.setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        } else if (current.hasAttribute(`prev-page`)) {
          //
          this.pagination.start -= this.pagination.amount;
          this.pagination.end -= this.pagination.amount;
          this.pagination.page--;

          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`)?.setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        } else if (current.hasAttribute(`next-page`)) {
          //
          this.pagination.start += this.pagination.amount;
          this.pagination.end += this.pagination.amount;
          this.pagination.page++;

          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`)?.setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        } else if (current.hasAttribute(`last-page`)) {
          //
          this.pagination.start += this.pagination.amount;
          this.pagination.end += this.pagination.amount;
          this.pagination.page = this.pagination.totalPages - 1;
          this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
          this.querySelector(`sec-facts-menu-single`)?.setAttribute(
            `pagination`,
            `${JSON.stringify(this.pagination)}`
          );
        }
      });
    });

    selectPage?.addEventListener(`click`, () => {
      const newPage = parseInt((selectPage as HTMLInputElement).value);
      if (newPage !== this.pagination.page) {
        this.pagination.start += this.pagination.amount;
        this.pagination.end += this.pagination.amount;
        this.pagination.page = newPage;
        this.setAttribute(`pagination`, `${JSON.stringify(this.pagination)}`);
        this.querySelector(`sec-facts-menu-single`)?.setAttribute(
          `pagination`,
          `${JSON.stringify(this.pagination)}`
        );
      }
    });
  }
}
