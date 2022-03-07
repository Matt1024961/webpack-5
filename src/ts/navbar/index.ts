import { Logger } from 'typescript-logger';
import Data from '../filters/data';
import MoreFilters from '../filters/more_filters';
import Tags from '../filters/tags';
import template from './template.html';

export default class Navbar {
  private logger: Logger;
  constructor(querySelector: string, logger: Logger) {
    this.logger = logger;
    this.render(querySelector);
    new Data(`[template-data]`, logger);
    new Tags(`[template-tags]`, logger);
    new MoreFilters(`[template-more-filters]`, logger);
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
      this.logger.info('Navigation Bar rendered');
    } else {
      this.logger.warn('Navigation Bar NOT rendered');
    }
  }
}
