import { Logger } from 'typescript-logger';
import Menu from '../menu';
import Data from '../data';
import MoreFilters from '../more_filters';
import Search from '../search';
import Tags from '../tags';
import template from './template.html';

export default class Navbar {
  private logger: Logger;
  constructor(querySelector: string, logger: Logger) {
    this.logger = logger;
    this.render(querySelector);

    new Menu(`[template-menu]`, logger);
    new Search(`[template-search]`, logger);
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
