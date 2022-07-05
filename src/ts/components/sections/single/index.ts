import { SectionsTable as SectionsTableType } from '../../../types/sections-table';
import template from './template.html';
import { getAllActiveSections } from '../../../redux/reducers/sections';
import { ConstantApplication } from '../../../constants/application';
import * as bootstrap from 'bootstrap';
import { FilingUrl } from '../../../filing-url';
import { getURLs } from '../../../redux/reducers/url';
import { FilingURL } from '../../../types/filing-url';

export class SectionsMenuSingle extends HTMLElement {
  static get observedAttributes() {
    return [`update`, `reset`];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  async attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === `update` && newValue) {
      this.updateIcons();
      this.removeAttribute(`update`);
    }
    if (name === `reset` && newValue) {
      ConstantApplication.removeChildNodes(this);
      this.render();
      this.listeners();

      this.removeAttribute(`reset`);
    }
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      // get all sections data
      const filing = (getURLs() as FilingURL).filing;
      const sections = this.simplifySectionsData(getAllActiveSections());
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
          sections[current].sort((a: any, b: any): -1 | 0 | 1 => {
            const first = a.longName;
            const second = b.longName;
            return first < second ? -1 : first > second ? 1 : 0;
          });
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
            li.setAttribute(`data-bs-toggle`, `popover`);
            li.setAttribute(
              `title`,
              `Report File: ${nestedCurrent.reportFile}`
            );
            li.setAttribute(
              `data-bs-content`,
              `Long Name: ${nestedCurrent.longName} <hr>Click to go to this section.`
            );

            if (filing !== nestedCurrent.baseRef) {
              const i = document.createElement(`i`);
              i.classList.add(`fas`);
              i.classList.add(`fa-external-link-alt`);
              i.classList.add(`mx-3`);
              li.append(i);
            }
            const span = document.createElement(`span`);
            const text = document.createTextNode(nestedCurrent.shortName);
            span.append(text);
            li.append(span);
            contentSelector?.append(li);
          });

          node.removeAttribute(`template`);
          this.append(node);
        });
      }
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  simplifySectionsData(input: Array<SectionsTableType>) {
    return input.reduce(
      (accumulator: { [key: string]: Array<unknown> }, current) => {
        if (
          Object.prototype.hasOwnProperty.call(
            accumulator,
            current.groupType as string
          )
        ) {
          accumulator[current.groupType as string].push(current);
        } else {
          accumulator[current.groupType as string] = [];

          accumulator[current.groupType as string].push(current);
        }
        return accumulator;
      },
      {}
    );
  }

  updateIcons() {
    const filing = (getURLs() as FilingURL).filing;
    this.querySelectorAll(`li`).forEach((current) => {
      current.querySelector(`.fas`)?.remove();
      if (current.getAttribute(`baseref`) !== filing) {
        // we add the icon
        const i = document.createElement(`i`);
        i.classList.add(`fas`);
        i.classList.add(`fa-external-link-alt`);
        i.classList.add(`mx-3`);
        current.prepend(i);
      }
    });
  }

  listeners() {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    [...popoverTriggerList].map(
      (popoverTriggerEl) =>
        new bootstrap.Popover(popoverTriggerEl, {
          trigger: `hover`,
          html: true,
        })
    );
    const sections = this.querySelectorAll(`[name],[contextref]`);
    Array.from(sections).forEach((current) => {
      current.addEventListener(`click`, () => {
        const filing = (getURLs() as FilingURL).filing;
        if (filing !== current.getAttribute(`baseref`)) {
          new FilingUrl(current.getAttribute(`baseref`) as string, () => {
            setTimeout(() => {
              const elementToStrollIntoView = document.querySelector(
                `#filing-container [name="${current.getAttribute(
                  `name`
                )}"][contextref="${current.getAttribute(`contextref`)}"]`
              );
              elementToStrollIntoView?.scrollIntoView();
            });
          });
        } else {
          const elementToStrollIntoView = document.querySelector(
            `#filing-container [name="${current.getAttribute(
              `name`
            )}"][contextref="${current.getAttribute(`contextref`)}"]`
          );
          elementToStrollIntoView?.scrollIntoView();
        }
      });
    });
  }
}
