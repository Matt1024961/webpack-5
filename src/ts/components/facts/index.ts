import { Logger } from 'typescript-logger';
import template from './template.html';

export default class Facts {
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
      this.logger.info('Facts Menu rendered');
    } else {
      this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners(): void {
    const offcanvas = document.querySelector('#facts-offcanvas');
    if (offcanvas) {
      const idsToAlter = [`error`, `warning`, `filing`];
      offcanvas.addEventListener('show.bs.offcanvas', function () {
        idsToAlter.forEach((current) => {
          Object.assign(document.getElementById(current).style, {
            marginRight: `400px`,
            transition: `margin 100ms`,
          });
        });
      });
      offcanvas.addEventListener('hidden.bs.offcanvas', function () {
        idsToAlter.forEach((current) => {
          Object.assign(document.getElementById(current).style, {
            marginRight: `0px`,
            transition: `margin 100ms`,
          });
        });
      });
    }
  }
}
