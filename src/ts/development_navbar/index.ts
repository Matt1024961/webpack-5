import { Logger } from 'typescript-logger';

const template = require('./template.html').default;

export class DevelopmentNavbar {
  private logger: Logger;
  constructor(querySelector: string, logger: Logger) {
    this.logger = logger;
    this.render(querySelector);
  }

  developmentMode(): void {
    this.logger.info('Navigation Bar development mode');
  }

  render(querySelector: string) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    const temp = htmlDoc.querySelector(`#template`);
    const node = document.importNode(temp, true);
    if (process.env.NODE_ENV === 'production') {
      node.querySelectorAll('[data-development]').forEach(e => e.remove());
    } else {
      this.developmentMode()
    }
    document.body.querySelector(querySelector).append(node);
    //document.body.querySelector(querySelector).innerHTML = node.innerHTML;
    this.logger.info('Navigation Bar rendered');
  }
}
