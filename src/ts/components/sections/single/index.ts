import SectionsTable from '../../../indexedDB/sections';
import { StoreUrl } from '../../../store/url';
import { SectionsTable as SectionsTableType } from '../../../types/sections-table';
import template from './template.html';

export class SectionsMenuSingle extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.render();
    this.listeners();
  }

  async render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      // get all sections data
      const storeUrl: StoreUrl = StoreUrl.getInstance();
      const db: SectionsTable = new SectionsTable(storeUrl.dataURL);
      const sections = this.simplifySectionsData(await db.getSections());

      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        Object.keys(sections).forEach((current, index) => {
          const node = document.importNode(selector, true);

          node
            .querySelector(`[section-link]`)
            ?.setAttribute(`data-bs-target`, `#sections-accordion-${index}`);
          node
            .querySelector(`[section-link]`)
            ?.setAttribute(`aria-controls`, `sections-accordion-${index}`);
          node
            .querySelector(`[section-accordion]`)
            ?.setAttribute(`id`, `sections-accordion-${index}`);
          //section-accordion

          const title = document.createTextNode(current);
          node.querySelector(`[section-title]`)?.append(title);

          const count = document.createTextNode(`${sections[current].length}`);
          node.querySelector(`[section-count]`)?.append(count);

          const contentSelector = node.querySelector(`[section-multiple]`);

          // sort the options before presenting to the user
          sections[current].sort(
            (a: any, b: any): -1 | 0 | 1 => {
              const first = a.longName;
              const second = b.longName;
              return first < second
                ? -1
                : first > second
                  ? 1
                  : 0;
            }
          );
          sections[current].forEach((nestedCurrent: any) => {
            const li = document.createElement(`li`);
            li.classList.add(`click`);
            li.classList.add(`list-group-item`);
            li.classList.add(`list-group-item-action`);
            li.classList.add(`d-flex`);
            li.classList.add(`align-items-center`);
            li.setAttribute(`name`, nestedCurrent.name as string);
            li.setAttribute(`contextRef`, nestedCurrent.contextRef as string);
            li.setAttribute(`baseref`, nestedCurrent.baseRef as string);

            if (storeUrl.filing !== nestedCurrent.baseRef) {
              console.log(storeUrl.filing, nestedCurrent.baseRef);
              const i = document.createElement(`i`);
              i.classList.add(`fas`);
              i.classList.add(`fa-external-link-alt`);
              i.classList.add(`mx-3`);
              li.append(i);
            }
            const text = document.createTextNode(nestedCurrent.shortName);
            li.append(text);

            contentSelector?.append(li);
            //node.append(content);
          });

          node.removeAttribute(`template`);
          this.append(node);
        });
      }
      // node.removeAttribute(`template`);
      // this.append(node);
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  simplifySectionsData(input: any[]) {
    return input.reduce(
      (accumulator: { [key: string]: Array<string> }, current) => {
        if (
          Object.prototype.hasOwnProperty.call(accumulator, current.groupType)
        ) {
          accumulator[current.groupType].push(current);
        } else {
          accumulator[current.groupType] = [];

          accumulator[current.groupType].push(current);
        }
        return accumulator;
      },
      {}
    );
  }

  listeners() {
    // const facts = this.querySelectorAll(`[fact-id]`);
    // console.log(facts);
    // facts.forEach((current) => {
    //   current.addEventListener(`click`, () => {
    //     this.querySelectorAll(`[fact-id]`).forEach((nestedCurrent) => {
    //       nestedCurrent.classList.remove(`selected`);
    //     });
    //     current.classList.add(`selected`);
    //     const modal = document.createElement(`sec-modal-fact`);
    //     modal.setAttribute(`fact-id`, current.getAttribute(`fact-id`));
    //     document.querySelector(`#modal-container`).append(modal);
    //   });
    // });
  }
}
