import store from '../../../redux';
import { actions } from '../../../redux/reducers/filters';
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
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        this.append(node);
        //this.logger.info('More Filters Filter Bar rendered');
      }
    } else {
      //this.logger.warn('More Filters NOT rendered');
    }
  }

  listeners(): void {
    const form = this.querySelector('#global-search') as HTMLFormElement;
    const inputs = this.querySelectorAll('[name="search-checks"]');
    const clearButton = this.querySelector(`[name="clear-button"]`);
    if (form) {
      form.addEventListener('submit', (event) => {
        this.searchSubmit(form, event);
      });
    }
    if (inputs) {
      inputs.forEach((current) => {
        current.addEventListener(`change`, () => {
          this.searchOptionChange();
        });
      });
    }
    if (clearButton) {
      clearButton.addEventListener(`click`, (event) => {
        this.searchClear(form, event);
      });
    }
  }

  searchSubmit(form: HTMLFormElement, event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.searchOptionChange();
    const searchInput = form.elements['search-input'];
    store.dispatch(
      actions.filtersUpdate({
        id: 1,
        changes: { search: searchInput.value },
      })
    );
  }

  searchOptionChange() {
    const checkedInputs = this.querySelectorAll(
      '[name="search-checks"]:checked'
    );
    const searchOptions = Array.from(checkedInputs).map((checked) => {
      return parseInt(checked.getAttribute(`value`) as string, 10);
    });

    store.dispatch(
      actions.filtersOptionsUpdate({
        id: 1,
        changes: { searchOptions: searchOptions },
      })
    );
  }

  searchClear(form: HTMLFormElement, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    (
      this.querySelector(`[name="search-input"]`) as HTMLInputElement
    ).value = ``;
    store.dispatch(
      actions.filtersUpdate({
        id: 1,
        changes: { search: null },
      })
    );
    // const storeFilter: StoreFilter = StoreFilter.getInstance();
    // storeFilter.search = null;
  }
}
