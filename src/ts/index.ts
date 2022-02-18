import '../styles.scss';
import 'bootstrap';
import '@popperjs/core';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { Navbar } from './navbar';
(() => {
  new Navbar(`#navbar`);
})();
