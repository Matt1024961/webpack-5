import { Logger } from 'typescript-logger';
import template from './template.html';

export default class Information {
  private logger: Logger;
  constructor(querySelector: string, logger: Logger) {
    this.logger = logger;
    this.render(querySelector);
    this.listeners(querySelector);
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
      this.logger.info('Modal Information rendered');
    } else {
      this.logger.warn('Modal Information NOT rendered');
    }
  }

  listeners(querySelector: string) {
    const modal = document.body.querySelector(querySelector);
    const carousel = document.querySelector('#information-carousel');

    if (modal) {
      modal.addEventListener('hidden.bs.modal', function (event) {
        console.log(event);
        // do something...
      });
    }
    if (carousel) {
      carousel.addEventListener('slide.bs.carousel', (event) => {
        console.log(event);
        // do something...
      });
    }
  }
}
