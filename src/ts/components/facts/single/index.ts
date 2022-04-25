import { ConstantApplication } from '../../../constants/application';
import Database from '../../../database';
import { StoreData } from '../../../store/data';
import { StoreFilter } from '../../../store/filter';
import { StoreUrl } from '../../../store/url';
import { FactsTable } from '../../../types/facts-table';
//import { facts as factsType } from '../../../types/data-json';
//import { FactsTable } from '../../../types/facts-table';
import { WarningClass } from '../../../warning';

import template from './template.html';

export class FactsMenuSingle extends HTMLElement {
  private pagination = ConstantApplication.factMenuPagination;

  static get observedAttributes() {
    return [`pagination`];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    //
  }

  async attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {

    this.pagination = JSON.parse(newValue);
    this.empty();
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
      //const storeData: StoreData = StoreData.getInstance();
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const storeFilter: StoreFilter = StoreFilter.getInstance();

      const db: Database = new Database(storeUrl.dataURL);

      const facts = await db.getFactsPagination(storeUrl.filing,
        this.pagination.start,
        this.pagination.end,
        storeFilter.getAllFilters()
      );
      if (facts) {
        (facts as Array<FactsTable>).forEach((current, index, array) => {
          if (current) {
            // select the [template]
            const selector = htmlDoc.querySelector(`[template]`);
            const node = document.importNode(selector, true);
            node.removeAttribute(`template`);

            // add the fact id to the <a> tag
            if (current && current.htmlId) {
              node
                .querySelector(`[fact-action]`)
                .setAttribute(`fact-id`, current.htmlId);
              node.removeAttribute(`[fact-name]`);
            }

            // add the fact name
            const factName = document.createTextNode(
              current.standardLabel
            );
            node.querySelector(`[fact-name]`).appendChild(factName);
            node.removeAttribute(`fact-name`);

            // add the fact period
            const factPeriod = document.createTextNode(current.period);
            // document.createTextNode(
            //   storeData.getSimplePeriod(
            //     parseInt(current[`ixv:factAttributes`][3][1])
            //   ).text
            // );
            node.querySelector(`[fact-period]`).appendChild(factPeriod);
            node.removeAttribute(`fact-period`);

            // add the fact value
            const factValue = document.createTextNode(current.isHtml ? `Click To See This Fact` : current.value

            );
            node.querySelector(`[fact-value]`).appendChild(factValue);
            node.removeAttribute(`fact-value`);

            // add the fact quick info
            const factQuickInfo = document.createTextNode(
              `${current.isCustom ? `C` : ``}
               ${current.dimensions ? `D` : ``}
               ${current.isHidden ? `A` : ``} 
              `
              //   `${storeData.getIsCustomTag(current as factsType) ? `C` : ``}
              // ${storeData.getIsDimension(current as factsType) ? `D` : ``}
              // ${storeData.getIsAdditional(current as factsType) ? `A` : ``}`
            );
            node.querySelector(`[fact-quick-info]`).appendChild(factQuickInfo);
            node.removeAttribute(`fact-quick-info`);

            // add the fact count
            const factCount = document.createTextNode(
              `${this.pagination.start + index + 1}`
            );
            node.querySelector(`[fact-count]`).appendChild(factCount);
            node.removeAttribute(`fact-count`);

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
      //current.classList.remove(`selected`);
      current.addEventListener(`click`, () => {
        current.classList.remove(`selected`);
        const fact = storeData.getFactByID(current.getAttribute(`fact-id`));
        if (fact && document.querySelector(`#${fact.id}`)) {
          this.querySelectorAll(`[fact-id]`).forEach((nestedCurrent) => {
            nestedCurrent.classList.remove(`selected`);
          });
          const modal = document.createElement(`sec-modal-fact`);
          modal.setAttribute(`fact-id`, fact.id);
          document.querySelector(`#modal-container`).append(modal);

          current.classList.add(`selected`);
        } else {
          const warning = new WarningClass();
          warning.show(`This Fact can not be found on this Filing!`);
        }
      });
    });
  }
}
