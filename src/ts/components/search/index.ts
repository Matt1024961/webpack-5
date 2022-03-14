import { Logger } from 'typescript-logger';
import template from './template.html';

export default class Search {
  private logger: Logger;
  constructor(querySelector: string, logger: Logger) {
    this.logger = logger;
    this.render(querySelector);
    this.listeners();
  }

  render(querySelector: string) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (
      htmlDoc.querySelector(`[template]`) &&
      document.body.querySelector(querySelector)
    ) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      document.body.querySelector(querySelector).append(node);
      this.logger.info('More Filters Filter Bar rendered');
    } else {
      this.logger.warn('More Filters NOT rendered');
    }
  }

  listeners(): void {
    const form = document.querySelector('#global-search');
    const inputs = document.querySelectorAll('[name="search-checks"]');
    // const checkedInputs = document.querySelectorAll('[name="search-checks"]:checked');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(event);
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
  }
}
