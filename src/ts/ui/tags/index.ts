import { Logger } from 'typescript-logger';
import template from './template.html';

export default class Tags {
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
      this.logger.info('Tags Filter Bar rendered');
    } else {
      this.logger.warn('Tags Filter NOT rendered');
    }
  }

  listeners(): void {
    const radios = document.querySelectorAll('[name="tags-radios"]');
    if (radios) {
      radios.forEach((current) => {
        current.addEventListener(`change`, () => {
          console.log(current.getAttribute(`value`));
        });
      });
    }
  }
}
