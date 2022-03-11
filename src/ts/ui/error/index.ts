import { Logger } from 'typescript-logger';
import template from './template.html';

export class Error {
  private message: string;
  private logger: Logger;
  private disable: boolean;
  constructor(
    querySelector: string,
    message = `An Error has occured.`,
    disabledApplication = false,
    logger: Logger
  ) {
    this.message = message;
    this.logger = logger;
    this.disable = disabledApplication;
    this.init(querySelector);
  }

  init(querySelector: string): void {
    this.render(querySelector);
    if (this.disable) {
      this.disableApplication();
    }
  }

  render(querySelector: string): void {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (
      htmlDoc.querySelector(`[template]`) &&
      document.body.querySelector(querySelector)
    ) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const textToAdd = document.createTextNode(this.message);
      node.querySelector(`[error-text]`).appendChild(textToAdd);
      node.removeAttribute(`error-text`);
      document.body.querySelector(querySelector).append(node);
      this.logger.info('Error Banner rendered');
    } else {
      this.logger.warn('Error Banner NOT rendered');
    }
  }

  disableApplication(): void {
    document.querySelectorAll(`#navbar .nav-link`).forEach((current) => {
      current.classList.add(`disabled`);
    });
    document.querySelectorAll(`#global-search fieldset`).forEach((current) => {
      current.setAttribute(`disabled`, `true`);
    });
  }
}
