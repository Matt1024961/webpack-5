import * as bootstrap from 'bootstrap';
import SettingsTable from '../../../indexedDB/settings';
import { StoreFilter } from '../../../store/filter';
import { StoreLogger } from '../../../store/logger';
import { BaseModal } from '../base-modal';
import template from './template.html';

export class Settings extends BaseModal {
  constructor() {
    super();
  }

  async connectedCallback() {
    BaseModal.prototype.init.call(this, ['Settings']);

    await this.page1();
    this.formListeners();
  }

  async page1() {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      const carousel = this.querySelector(`[carousel-items]`);
      const db: SettingsTable = new SettingsTable();
      const settings = await db.getSettingsData();
      // const allFacts = this.querySelector(
      //   `[name="allFacts"]`
      // ) as HTMLSelectElement;
      // allFacts.value = settings.allFacts;
      // console.log(settings);
      carousel.append(node);
      const allFacts = this.querySelector(
        `[name="allFacts"]`
      ) as HTMLSelectElement;
      allFacts.value = settings.allFacts;
      console.log(settings);
      storeLogger.info('Settings Modal rendered');
    } else {
      storeLogger.error('Settings Modal NOT rendered');
    }
  }

  formListeners() {
    const allFacts = this.querySelector(
      `[name="allFacts"]`
    ) as HTMLSelectElement;
    allFacts.addEventListener(`change`, (event) => {
      this.updateAllFacts(
        parseInt((event.target as HTMLSelectElement).value, 10)
      );
    });
  }

  async updateAllFacts(input: number) {
    const db: SettingsTable = new SettingsTable();
    await db.updateAllFacts(input);
    this.toast(`Show All Facts Setting Updated`);
    const moreFilters = document.querySelector(`sec-more-filters`);
    moreFilters.setAttribute(`empty`, `true`);
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    storeFilter.filterFacts();
  }

  toast(input: string) {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const content = this.querySelector(`[toast-content]`);
    if (content) {
      const span = document.createElement(`span`);
      const text = document.createTextNode(input);
      span.append(text);
      content.firstElementChild.replaceWith(span);
      const toast = new bootstrap.Toast(this.querySelector('#liveToast'));
      toast.show();
      storeLogger.info('Settings Modal Toast rendered');
    } else {
      storeLogger.error('Settings Modal NOT rendered');
    }
  }
}
