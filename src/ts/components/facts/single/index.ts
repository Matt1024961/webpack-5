import { ConstantApplication } from '../../../constants/application';
import { getFactPagination } from '../../../redux/reducers/facts';
import { FactsTable } from '../../../types/facts-table';
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

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    this.pagination = JSON.parse(newValue as string);
    this.empty();
    this.render();
    this.listeners();
  }

  empty() {
    ConstantApplication.removeChildNodes(this);
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const facts = getFactPagination(
        this.pagination.start,
        this.pagination.end
      );

      if (facts) {
        (facts as Array<FactsTable>).forEach((current, index) => {
          if (current) {
            // select the [template]
            const selector = htmlDoc.querySelector(`[template]`);
            if (selector) {
              const node = document.importNode(selector, true);
              node.removeAttribute(`template`);
              // add the fact id to the <a> tag
              if (current && current.htmlId) {
                node
                  .querySelector(`[fact-action]`)
                  ?.setAttribute(`fact-id`, current.htmlId);
                node.removeAttribute(`[fact-name]`);
              }
              // add the fact name
              const factName = document.createTextNode(
                current.standardLabel as string
              );
              node.querySelector(`[fact-name]`)?.appendChild(factName);
              node.removeAttribute(`fact-name`);
              // add the fact period
              const factPeriod = document.createTextNode(
                current.period as string
              );
              node.querySelector(`[fact-period]`)?.appendChild(factPeriod);
              node.removeAttribute(`fact-period`);
              // add the fact value
              const factValue = document.createTextNode(
                current.isHtml
                  ? `Click To See This Fact`
                  : (current.value as string)
              );
              node.querySelector(`[fact-value]`)?.appendChild(factValue);
              node.removeAttribute(`fact-value`);
              // add the fact quick info
              const factQuickInfoText = `${current.isCustom ? `C` : ``} ${
                current.dimensions ? `D` : ``
              } ${current.isHidden ? `A` : ``}`.trim();
              const factQuickInfo = document.createTextNode(
                factQuickInfoText.split(` `).join(` & `)
              );
              node
                .querySelector(`[fact-quick-info]`)
                ?.appendChild(factQuickInfo);
              node.removeAttribute(`fact-quick-info`);
              // add the fact count
              const factCount = document.createTextNode(
                `${this.pagination.start + index + 1}`
              );
              node.querySelector(`[fact-count]`)?.appendChild(factCount);
              node.removeAttribute(`fact-count`);
              this.append(node);
            } else {
              // console.log(current);
              // console.log(index);
              // console.log(array);
            }
          }
        });
      }
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners() {
    const facts = this.querySelectorAll(`[fact-id]`);

    facts.forEach((current) => {
      current.addEventListener(`click`, () => {
        this.querySelectorAll(`[fact-id]`).forEach((nestedCurrent) => {
          nestedCurrent.classList.remove(`selected`);
        });
        current.classList.add(`selected`);
        const modal = document.createElement(`sec-modal-fact`);
        modal.setAttribute(
          `fact-id`,
          current.getAttribute(`fact-id`) as string
        );
        document.querySelector(`#modal-container`)?.append(modal);
      });
    });
  }
}
