import { ErrorClass } from '../../../error';
import { Attributes } from '../../../store/attributes';
import { StoreData } from '../../../store/data';
import { StoreFilter } from '../../../store/filter';
import { StoreUrl } from '../../../store/url';
import template from './template.html';

export class Search extends HTMLElement {
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
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      //this.logger.info('More Filters Filter Bar rendered');
    } else {
      //this.logger.warn('More Filters NOT rendered');
    }
  }

  listeners(): void {
    const form = this.querySelector('#global-search') as HTMLFormElement;
    const inputs = this.querySelectorAll('[name="search-checks"]');
    const clearButton = this.querySelector(`[name="clear-button"]`);
    // const checkedInputs = document.querySelectorAll('[name="search-checks"]:checked');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const searchInput = form.elements['search-input'];
        const storeFilter: StoreFilter = StoreFilter.getInstance();
        storeFilter.search = searchInput.value;

        if (window.Worker) {
          const storeUrl: StoreUrl = StoreUrl.getInstance();
          const storeData: StoreData = StoreData.getInstance();
          const worker = new Worker(
            new URL('./../../../worker/filter', import.meta.url)
          );
          worker.postMessage({
            facts: storeData.getFilingFacts(storeUrl.filing),
            search: storeFilter.search,
          });

          worker.onmessage = (event) => {
            if (event.data) {
              storeData.setFilingFactsActive(event.data.filteredFacts);
              const attributes = new Attributes();
              attributes.setActiveFact();
            }
          };
        } else {
          const error = new ErrorClass();
          error.show(
            `Your Browser does not have the functionality to do this.`
          );
        }
        console.log(searchInput.value);
      });
    }
    if (inputs) {
      inputs.forEach((current) => {
        current.addEventListener(`change`, () => {
          const checkedInputs = document.querySelectorAll(
            '[name="search-checks"]:checked'
          );
          const userOptions = Array.from(checkedInputs).map((checked) => {
            return parseInt(checked.getAttribute(`value`), 10);
          });
          console.log(userOptions);
        });
      });
    }
    if (clearButton) {
      console.log();
      clearButton.addEventListener(`click`, (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(event);
      });
    }
  }
}
