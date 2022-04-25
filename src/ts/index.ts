import 'bootstrap';
import '@popperjs/core';
import '../styles.scss';

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
import { Information } from './components/modals/information';
import { BaseModal } from './components/modals/base-modal';

(() => {
  const storeLogger: StoreLogger = StoreLogger.getInstance();

  storeLogger.info(`Application Begin`);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: `/` })
        .then(() => {
          storeLogger.info('Service Worker Registered Successfully!');
        })
        .catch(() => {
          storeLogger.error('Service Worker NOT Registered!');
        });
    });
  } else {
    storeLogger.error('Service Worker not available on your browser!');
  }

  // window.addEventListener('beforeunload', function (e) {
  //   console.log(`we now delete the DB!`);
  //   // Cancel the event
  //   //e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  //   // Chrome requires returnValue to be set
  //   e.returnValue = '';
  // });

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
  // all the modals
  customElements.define(`sec-modal-base`, BaseModal);
  customElements.define(`sec-modal-fact`, Fact);
  customElements.define(`sec-modal-information`, Information);
  // end all the modals

  if (process.env.NODE_ENV !== 'production') {
    // we are in development mode
    customElements.define(`sec-dev-navbar`, DevelopmentNavbar);
  }
})();
