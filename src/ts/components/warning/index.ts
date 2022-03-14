import { Tooltip } from 'bootstrap';
import { Logger } from 'typescript-logger';
import template from './template.html';

export class Warning {
  private message: string;
  private logger: Logger;
  private disable: boolean;
  constructor(
    querySelector: string,
    message = `An Error has occured.`,
    disable = false,
    logger: Logger
  ) {
    this.message = message;
    this.logger = logger;
    this.disable = disable;
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
      node.querySelector(`[warning-text]`).appendChild(textToAdd);
      node.removeAttribute(`warning-text`);
      document.body.querySelector(querySelector).append(node);
      this.logger.info('Warning Banner rendered');
    } else {
      this.logger.warn('Warning Banner NOT rendered');
    }
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
      (tooltipTriggerEl: Element) => {
        new Tooltip(tooltipTriggerEl);
      }
    );
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
