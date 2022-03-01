 import '../styles.scss';
import 'bootstrap';
import '@popperjs/core';
import { LoggerManager } from 'typescript-logger';
import '../styles.scss';
import { DevelopmentNavbar } from './development_navbar';
import Navbar from './navbar';
import { FilingUrl } from './filing-url';


(() => {
  const logger = LoggerManager.create('Inline XBRL Viewer');
  logger.info('Application Begin');
  new FilingUrl(logger);
  if (process.env.NODE_ENV === 'production') {
    // we are in production mode
  } else {
    // we are in development mode
    new DevelopmentNavbar(`#development_navbar`, logger);
  }
  new Navbar(`#navbar`, logger);
})();
