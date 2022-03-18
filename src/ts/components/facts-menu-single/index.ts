// import { Logger } from 'typescript-logger';
import { StoreData } from '../../store/data';
import { StoreUrl } from '../../store/url';
import { facts as factsType } from '../../types/data-json';

import template from './template.html';

export class FactsMenuSingle extends HTMLElement {
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
    this.empty();
    this.render();
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
      const facts = storeData.getFilingFactsPagination(
        storeUrl.filing,
        this.pagination.start,
        this.pagination.end
      );
      if (facts) {
        // console.log(`FACTS: ${facts.length}`);
        facts.forEach((current, index, array) => {
          if (current) {
            // select the [template]
            const selector = htmlDoc.querySelector(`[template]`);
            const node = document.importNode(selector, true);
            node.removeAttribute(`template`);

            // add the fact id to the <a> tag
            if (current && current.id) {
              node
                .querySelector(`[fact-action]`)
                .setAttribute(`fact-id`, current.id);
              node.removeAttribute(`[fact-name]`);
            }

            // add the fact name
            const factName = document.createTextNode(
              current[`ixv:standardLabel`]
            );
            node.querySelector(`[fact-name]`).appendChild(factName);
            node.removeAttribute(`fact-name`);

            // add the fact period
            const factPeriod = document.createTextNode(
              storeData.getSimplePeriod(
                parseInt(current[`ixv:factAttributes`][3][1])
              )
            );
            node.querySelector(`[fact-period]`).appendChild(factPeriod);
            node.removeAttribute(`fact-period`);

            // add the fact value
            const factValue = document.createTextNode(
              current[`ixv:factAttributes`][2][1]
                ? `Click To See This Fact`
                : current.value
            );
            node.querySelector(`[fact-value]`).appendChild(factValue);
            node.removeAttribute(`fact-value`);

            // add the fact quick info
            const factQuickInfo = document.createTextNode(
              `${storeData.getIsCustomTag(current as factsType) ? `C` : ``}
            ${storeData.getIsDimension(current as factsType) ? `D` : ``}
            ${storeData.getIsAdditional(current as factsType) ? `A` : ``}`
            );
            node.querySelector(`[fact-quick-info]`).appendChild(factQuickInfo);
            node.removeAttribute(`fact-quick-info`);

            this.append(node);
          } else {
            console.log(current);
            console.log(index);
            console.log(array);
          }
        });
      }
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners() {
    const facts = this.querySelectorAll(`[fact-id]`);
    const storeData: StoreData = StoreData.getInstance();
    facts.forEach((current) => {
      current.addEventListener(`click`, () => {
        const fact = storeData.getFactByID(current.getAttribute(`fact-id`));
        if (fact && document.querySelector(fact.id)) {
          document.querySelector(fact.id).scrollIntoView();
        } else {
          this.showWarning(`This Fact can not be found on this Filing!`);
        }
      });
    });
  }

  showError(message: string): void {
    const error = document.createElement(`sec-error`);
    error.setAttribute(`message`, message);
    document.querySelector(`#error-container`).appendChild(error);
  }

  showWarning(message: string) {
    const warning = document.createElement(`sec-warning`);
    warning.setAttribute(`message`, message);
    document.querySelector(`#warning-container`).appendChild(warning);
  }
}