import 'bootstrap';
import '@popperjs/core';
import '../styles.scss';
import { detect } from 'detect-browser';

import { DevelopmentNavbar } from './components/nav/development_navbar';
import { Navbar } from './components/nav/navbar';
import { Sections } from './components/nav/sections';
import { Data } from './components/nav/data';
import { Menu } from './components/nav/menu';
import { SectionsMenu } from './components/sections';
import { Root } from './components/root';
import { Search } from './components/nav/search';
import { Tags } from './components/nav/tags';
import { MoreFilters } from './components/nav/more_filters';
import { Facts } from './components/nav/facts';
import { FactsMenu } from './components/facts/menu';
import { FactsMenuSingle } from './components/facts/single';
import { FactsMenuPagination } from './components/facts/pagination';
import { StoreLogger } from './store/logger';
import { Warning } from './components/warning';
import { Error } from './components/error';
import { Filing } from './components/filing';
import { Fact } from './components/modals/fact';
import { Links } from './components/nav/links';
import { ResetAllFilters } from './components/nav/reset_all_filters';

(() => {

  const browser = detect();

  console.log(browser);
  const storeLogger: StoreLogger = StoreLogger.getInstance();
  storeLogger.info(`Application Begin`);
  // here we hadd all custom HTML components
  customElements.define('sec-root', Root);
  customElements.define('sec-navbar', Navbar);
  customElements.define('sec-menu', Menu);
  customElements.define(`sec-sections`, Sections);
  customElements.define(`sec-sections-menu`, SectionsMenu);
  customElements.define(`sec-search`, Search);
  customElements.define('sec-data', Data);
  customElements.define('sec-tags', Tags);
  customElements.define('sec-more-filters', MoreFilters);
  customElements.define(`sec-reset-all-filters`, ResetAllFilters);
  customElements.define('sec-links', Links);
  customElements.define('sec-facts', Facts);
  customElements.define('sec-facts-menu', FactsMenu);
  customElements.define('sec-facts-menu-pagination', FactsMenuPagination);
  customElements.define('sec-facts-menu-single', FactsMenuSingle);
  customElements.define(`sec-error`, Error);
  customElements.define(`sec-warning`, Warning);
  customElements.define(`sec-filing`, Filing);
  customElements.define(`sec-modal-fact`, Fact);

  if (process.env.NODE_ENV !== 'production') {
    // we are in development mode
    customElements.define(`sec-dev-navbar`, DevelopmentNavbar);
  }
})();
