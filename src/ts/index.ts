// import '../styles.scss';
import 'bootstrap';
import '@popperjs/core';
import { LoggerManager } from 'typescript-logger';
import '../styles.scss';
import { DevelopmentNavbar } from './development_navbar';
import Navbar from './navbar';
import { FilingUrl } from './filing-url';
import Sections from './sections';

(() => {
  const logger = LoggerManager.create('Inline XBRL Viewer', `#003768`);

  if (process.env.NODE_ENV === 'production') {
    // we are in production mode
    LoggerManager.setProductionMode();
  } else {
    // we are in development mode
    new DevelopmentNavbar(`#development_navbar`, logger);
  }
  logger.info('Application Begin');
  new FilingUrl(logger);
  new Navbar(`#navbar`, logger);
  new Sections(`#sections`, logger);


  // const myOffcanvas = document.getElementById('sections-offcanvas');
  // console.log(myOffcanvas);
  // myOffcanvas.addEventListener('hidden.bs.offcanvas', function () {
  //   // do something...
  // });
})();
