import '../styles.scss';
import 'bootstrap';
import '@popperjs/core';
import { LoggerManager } from 'typescript-logger';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../styles.scss';

import { Navbar } from './navbar';
import { FilingUrl } from './filing-url';
(() => {
  const logger = LoggerManager.create('Inline XBRL Viewer');
  logger.info('Application Begin');
  new FilingUrl(logger);
  new Navbar(`#navbar`, logger);
})();
