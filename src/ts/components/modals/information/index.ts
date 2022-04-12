// import { StoreLogger } from '../../../store/logger';
import { StoreData } from '../../../store/data';
import { BaseModal } from '../base-modal';
import * as structure from './index.json';
// import template from './template.html';

export class Information extends BaseModal {
  constructor() {
    super();
  }

  connectedCallback() {
    const jsonStructure = Object.keys(structure);
    jsonStructure.pop();
    BaseModal.prototype.render.call(this);
    BaseModal.prototype.listeners.call(this, jsonStructure);
    this.render();
    // this.listeners();
  }

  render() {
    const jsonStructure = Object.keys(structure);
    jsonStructure.pop();
    const carousel = this.querySelector(`[carousel-items]`);
    const indicatorLinks = this.querySelector(`[indicator-links]`);

    const storeData: StoreData = StoreData.getInstance();

    jsonStructure.forEach((current, index) => {
      const div = document.createElement(`div`);
      div.classList.add(`carousel-item`);
      if (index === 0) {
        div.classList.add(`active`);
      }
      const table = document.createElement(`table`);
      table.classList.add(`table`);
      table.classList.add(`table-sm`);
      table.classList.add(`table-striped`);

      const tbody = document.createElement(`tbody`);
      Object.keys(structure[current]).forEach((currentNested) => {
        const tr = document.createElement(`tr`);

        const th = document.createElement(`th`);
        const label = document.createTextNode(currentNested);


        const td = document.createElement(`td`);

        const factValue = storeData.getFactValueByName(structure[current][currentNested]).value;
        const label2 = document.createTextNode(`${factValue ? factValue : 'No Information.'}`);

        td.append(label2);
        th.append(label);
        tr.append(th);
        tr.append(td);
        tbody.append(tr);
      });
      table.append(tbody);

      div.append(table);
      carousel.append(div);

      const a = document.createElement(`a`);
      a.setAttribute(`type`, `button`);
      a.setAttribute(`data-bs-target`, `#modal-carousel`);
      a.setAttribute(`data-bs-slide-to`, `${index}`);
      a.setAttribute(`aria-label`, current);
      if (index === 0) {
        a.classList.add(`active`);
        a.setAttribute(`aria-current`, `true`);
      }
      indicatorLinks.append(a);
    });
  }

  listeners() {
    //
  }
}
