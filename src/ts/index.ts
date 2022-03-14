// import '../styles.scss';
import 'bootstrap';
import '@popperjs/core';
import { Tooltip } from 'bootstrap';
import { LoggerManager } from 'typescript-logger';
import '../styles.scss';
import { DevelopmentNavbar } from './components/development_navbar';
import Navbar from './components/navbar';
import { FilingUrl } from './filing-url';
import Sections from './components/sections';
import Facts from './components/facts';
import { Data } from './components/data';
import { Menu } from './components/menu';

(() => {
  // // here we hadd all custom HTML components
  // customElements.define('sec-data', Data(logger));

  const logger = LoggerManager.create('Inline XBRL Viewer', `#003768`);

  // here we hadd all custom HTML components
  customElements.define('sec-menu', Menu);
  customElements.define('sec-data', Data);

  if (process.env.NODE_ENV === 'production') {
    // we are in production mode
    LoggerManager.setProductionMode();
  } else {
    // we are in development mode
    new DevelopmentNavbar(`#development_navbar`, logger);
  }
  logger.info('Application Begin');
  //new FilingUrl(logger);
  new Navbar(`#navbar`, logger);
  new Sections(`#sections`, logger);
  new Facts(`#facts`, logger);
  new FilingUrl(logger);

  // turn on all tooltips
  Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
    (tooltipTriggerEl: Element) => {
      new Tooltip(tooltipTriggerEl);
    }
  );
})();
