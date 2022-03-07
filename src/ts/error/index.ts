import { Logger } from 'typescript-logger';
import template from './template.html';

export class Error {
  private message: string;
  private logger: Logger;
  constructor(
    querySelector: string,
    message = `An Error has occured.`,
    logger: Logger
  ) {
    this.message = message;
    this.logger = logger;
    this.init(querySelector);
  }

  init(querySelector: string): void {
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
      const textToAdd = document.createTextNode(this.message);
      node.querySelector('.alert').appendChild(textToAdd);
      document.body.querySelector(querySelector).append(node);
      this.logger.error('Error Banner rendered');
    } else {
      this.logger.warn('Error Banner NOT rendered');
    }
  }
}
