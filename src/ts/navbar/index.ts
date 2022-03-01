import { Logger } from 'typescript-logger';
import template from './template.html';

export default class Navbar {
  // huh?
  private logger: Logger;
  constructor(querySelector: string, logger: Logger) {
    this.logger = logger;
    this.render(querySelector);
  }

  render(querySelector: string) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (
      htmlDoc.querySelector(`#template`) &&
      document.body.querySelector(querySelector)
    ) {
      const selector = htmlDoc.querySelector(`#template`);
      const node = document.importNode(selector, true);
      document.body.querySelector(querySelector).append(node);
      this.logger.info('Navigation Bar rendered');
    } else {
      this.logger.warn('Navigation Bar NOT rendered');
    }
  }
}
