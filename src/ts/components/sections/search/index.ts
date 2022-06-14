import { ConstantApplication } from '../../../constants/application';
import store from '../../../redux';
import { getMultiFiling } from '../../../redux/reducers/facts';
import { actions } from '../../../redux/reducers/filters';
import template from './template.html';

export class SectionsMenuSearch extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
    ConstantApplication.setElementFocus(this.querySelector(`[name="sections-input"]`));

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
        if (getMultiFiling().length > 1) {
          Array.from(this.querySelectorAll(`.d-none`)).forEach((current) => {
            current.classList.remove(`d-none`)
          });
        }
      }
      //this.logger.info('More Filters Filter Bar rendered');
    } else {
      //this.logger.warn('More Filters NOT rendered');
    }
  }

  listeners(): void {
    const form = this.querySelector('#sections-search') as HTMLFormElement;
    const inputs = this.querySelectorAll('[name="sections-checks"], [name="sections-radios"]');
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
    const searchInput = form.elements['sections-input'];
    store.dispatch(
      actions.sectionsUpdate({
        id: 1,
        changes: { sections: searchInput.value }
      })
    );

  }

  searchOptionChange() {
    const checkedInputs = this.querySelectorAll(
      '[name="sections-checks"]:checked, [name="sections-radios"]:checked'
    );
    const searchOptions = Array.from(checkedInputs).map((checked: Element) => {
      return parseInt(checked.getAttribute(`value`) as string, 10);
    });
    store.dispatch(
      actions.sectionsOptionsUpdate({
        id: 1,
        changes: { sectionsOptions: searchOptions },
      })
    );
  }

  searchClear(form: HTMLFormElement, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    (
      this.querySelector(`[name="sections-input"]`) as HTMLInputElement
    ).value = ``;

    store.dispatch(
      actions.sectionsUpdate({
        id: 1,
        changes: { sections: null },
      })
    );
  }
}
