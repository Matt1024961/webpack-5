/* eslint-disable no-unused-vars */
import { ErrorClass } from '../../../error';
import { StoreData } from '../../../store/data';
import { StoreFilter } from '../../../store/filter';
import { Scale } from '../../../store/scale';
import template from './template.html';

export class MoreFilters extends HTMLElement {
  private populated = false;
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      //this.logger.info('More Filters Filter Bar rendered');
    } else {
      //this.logger.warn('More Filters NOT rendered');
    }
  }

  listeners(): void {
    const moreFiltersButton = this.querySelector(`#more-filters-button`);
    const dropdowns = document.querySelector('#more-filters-dropdown');
    if (moreFiltersButton) {
      moreFiltersButton.addEventListener(`show.bs.dropdown`, () => {
        if (!this.populated) {
          this.populateDropdownOptions();
          // this.listenersForCheckBoxes();
        }
      });
    }
    if (dropdowns) {
      dropdowns.addEventListener(`click`, (event) => {
        event.stopPropagation();
      });
    }
  }

  checkboxes(current: Element) {
    const name = current.getAttribute(`name`);
    const optionNames = [
      { name: `periods-options`, key: `periods` },
      { name: `axis-options`, key: `axis` },
      { name: `members-options`, key: `members` },
      { name: `scale-options`, key: `scale` },
      { name: `balance-options`, key: `balance` },
    ];
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    const found = optionNames.find((element) => element.name === name);
    if (found) {
      const userSelectedCheckBoxes = {
        [found.key]: Array.from(
          this.querySelectorAll(`[name="${name}"]:checked`)
        ).map((current) => {
          return parseInt(current.getAttribute(`value`));
        }),
      };
      const updatedFilter = Object.assign(
        storeFilter.moreFilters,
        userSelectedCheckBoxes
      );
      storeFilter.moreFilters = updatedFilter;
    } else if (name === `periods-year-options`) {
      const totalCheckBoxes = Array.from(
        this.querySelectorAll(
          `[data-bs-parent="#${current.getAttribute(
            `value`
          )}"] [type="checkbox"]`
        )
      );
      const checkedCheckBoxes = Array.from(
        this.querySelectorAll(
          `[data-bs-parent="#${current.getAttribute(
            `value`
          )}"] [type="checkbox"]:checked`
        )
      );
      const checkAllBoxes =
        totalCheckBoxes.length === checkedCheckBoxes.length ? false : true;

      totalCheckBoxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = checkAllBoxes;
        const event = new Event('change');
        checkbox.dispatchEvent(event);
      });
    } else {
      const error = new ErrorClass();
      error.show(
        `An internal error has occured, the option you have selected does not exsist.`
      );
    }
  }

  populateDropdownOptions() {
    const storeData: StoreData = StoreData.getInstance();
    this.populatePeriods(storeData);
    this.populateMeasures(storeData);
    this.populateAxis(storeData);
    this.populateMembers(storeData);
    this.populateScale(storeData);
    this.populateBalance(storeData);
    this.populated = true;
    const checkboxes = this.querySelectorAll('input[type=checkbox]');
    if (checkboxes) {
      checkboxes.forEach((current) => {
        current.addEventListener(`change`, () => {
          this.checkboxes(current);
        });
      });
    }
  }

  populatePeriods(storeData: StoreData) {
    const periodCount = document.createTextNode(
      `${storeData.filterPeriods.length}`
    );
    this.querySelector(`[period-count]`).append(periodCount);

    Object.keys(storeData.complexPeriods)
      .sort()
      .reverse()
      .forEach((current, index) => {
        const div = document.createElement(`div`);
        div.classList.add(`d-flex`);
        div.classList.add(`justify-content-start`);

        const input = document.createElement(`input`);
        input.setAttribute(`name`, `periods-year-options`);
        input.setAttribute(`type`, `checkbox`);
        input.setAttribute(`value`, `periods-accordion-${index}`);
        input.setAttribute(`id`, `periods-year-options-${index}`);
        input.classList.add(`form-check-input`);
        input.classList.add(`me-1`);

        const a = document.createElement(`a`);
        a.classList.add(`btn`);
        a.classList.add(`btn-link`);
        a.classList.add(`d-flex`);
        a.classList.add(`justify-content-between`);
        a.classList.add(`align-items-center`);
        a.classList.add(`w-100`);
        a.classList.add(`text-primary`);
        a.classList.add(`collapsed`);
        a.classList.add(`no-text-decoration`);
        a.classList.add(`p-0`);
        a.setAttribute(`data-bs-toggle`, `collapse`);
        a.setAttribute(`data-bs-target`, `#periods-accordion-${index}`);
        a.setAttribute(`aria-expanded`, `false`);
        a.setAttribute(`aria-controls`, `periods-accordion-${index}`);

        const span = document.createElement(`span`);
        const text = document.createTextNode(current);

        span.append(text);

        const span1 = document.createElement(`span`);
        span1.classList.add(`badge`);
        span1.classList.add(`bg-secondary`);

        const badgeText = document.createTextNode(
          `${storeData.complexPeriods[current].length}`
        );

        span1.append(badgeText);

        a.append(span);
        a.append(span1);

        div.append(input);
        div.append(a);

        this.querySelector(`[period-options]`).append(div);

        const div2 = document.createElement(`div`);
        div2.classList.add(`accordion-collapse`);
        div2.classList.add(`collapse`);
        div2.setAttribute(`id`, `periods-accordion-${index}`);
        div2.setAttribute(`data-bs-parent`, `#periods-accordion-${index}`);

        const div3 = document.createElement(`div`);
        div3.classList.add(`p-1`);

        const fieldset = document.createElement(`fieldset`);
        fieldset.classList.add(`px-1`);
        fieldset.classList.add(`more-filters-options`);
        fieldset.setAttribute(`period-options`, ``);
        fieldset.setAttribute(`value`, `${current}`);

        storeData.complexPeriods[current].forEach((currentNest) => {
          const div = document.createElement(`div`);
          div.classList.add(`w-100`);
          div.classList.add(`d-flex`);
          div.classList.add(`justify-content-start`);

          const input = document.createElement(`input`);
          input.setAttribute(`name`, `periods-options`);
          input.setAttribute(`type`, `checkbox`);
          input.setAttribute(`value`, `${currentNest.value}`);
          input.setAttribute(`id`, `periods-checkbox-${index}`);
          input.classList.add(`form-check-input`);
          input.classList.add(`me-1`);

          const label = document.createElement(`label`);
          label.setAttribute(`for`, `periods-checkbox-${index}`);
          label.classList.add(`form-check-label`);
          label.classList.add(`text-capitalize`);
          label.classList.add(`text-break`);
          label.classList.add(`w-100`);

          const text = document.createTextNode(currentNest.text);

          label.append(text);
          div.append(input);
          div.append(label);
          fieldset.append(div);
        });
        div3.append(fieldset);
        div2.append(div3);
        this.querySelector(`[period-options]`).append(div2);
      });
  }

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  populateMeasures(storeData: StoreData) {
    const measuresCount = document.createTextNode(`NEED INFO!`);
    this.querySelector(`[measures-count]`).append(measuresCount);
  }

  populateBalance(storeData: StoreData) {
    const balanceCount = document.createTextNode(
      `${storeData.filterBalance.length}`
    );
    this.querySelector(`[balance-count]`).append(balanceCount);

    storeData.filterBalance.forEach((current, index) => {
      const li = document.createElement(`li`);
      const div = document.createElement(`div`);
      div.classList.add(`w-100`);
      div.classList.add(`d-flex`);
      div.classList.add(`justify-content-start`);

      const input = document.createElement(`input`);
      input.setAttribute(`name`, `balance-options`);
      input.setAttribute(`type`, `checkbox`);
      input.setAttribute(`value`, `${index}`);
      input.setAttribute(`id`, `balance-checkbox-${index}`);
      input.classList.add(`form-check-input`);
      input.classList.add(`me-1`);

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);
      label.classList.add(`text-capitalize`);
      label.classList.add(`text-break`);
      label.classList.add(`w-100`);
      label.setAttribute(`for`, `balance-checkbox-${index}`);

      const text = document.createTextNode(current);

      label.append(text);
      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`[balance-options]`).append(li);
    });
  }

  populateScale(storeData: StoreData) {
    const scaleCount = document.createTextNode(
      `${storeData.filterScale.length}`
    );
    this.querySelector(`[scale-count]`).append(scaleCount);
    storeData.filterScale
      .sort()
      .reverse()
      .forEach((current, index) => {
        const li = document.createElement(`li`);
        const div = document.createElement(`div`);
        div.classList.add(`w-100`);
        div.classList.add(`d-flex`);
        div.classList.add(`justify-content-start`);

        const input = document.createElement(`input`);
        input.setAttribute(`name`, `scale-options`);
        input.setAttribute(`type`, `checkbox`);
        input.setAttribute(`value`, `${index}`);
        input.setAttribute(`id`, `scale-checkbox-${index}`);
        input.classList.add(`form-check-input`);
        input.classList.add(`me-1`);

        const label = document.createElement(`label`);
        label.classList.add(`form-check-label`);
        label.classList.add(`text-capitalize`);
        label.classList.add(`text-break`);
        label.classList.add(`w-100`);
        label.setAttribute(`for`, `scale-checkbox-${index}`);

        const text = document.createTextNode(Scale[current]);

        label.append(text);
        div.append(input);
        div.append(label);
        li.append(div);

        this.querySelector(`[scale-options]`).append(li);
      });
  }

  populateMembers(storeData: StoreData) {
    const membersCount = document.createTextNode(
      `${storeData.filterMembers.length}`
    );
    this.querySelector(`[members-count]`).append(membersCount);
    storeData.filterMembers.forEach((current, index) => {
      const li = document.createElement(`li`);
      const div = document.createElement(`div`);
      div.classList.add(`w-100`);
      div.classList.add(`d-flex`);
      div.classList.add(`justify-content-start`);

      const input = document.createElement(`input`);
      input.setAttribute(`name`, `members-options`);
      input.setAttribute(`type`, `checkbox`);
      input.setAttribute(`value`, `${index}`);
      input.setAttribute(`id`, `members-checkbox-${index}`);
      input.classList.add(`form-check-input`);
      input.classList.add(`me-1`);

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);
      label.classList.add(`text-capitalize`);
      label.classList.add(`text-break`);
      label.classList.add(`w-100`);
      label.setAttribute(`for`, `members-checkbox-${index}`);

      current = current
        .substring(current.indexOf(`:`) + 1)
        .replace(/([A-Z])/g, ` $1`)
        .trim();

      const text = document.createTextNode(current);

      label.append(text);
      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`[members-options]`).append(li);
    });
  }

  populateAxis(storeData: StoreData) {
    const axisCount = document.createTextNode(`${storeData.filterAxis.length}`);
    this.querySelector(`[axis-count]`).append(axisCount);

    storeData.filterAxis.forEach((current, index) => {
      const li = document.createElement(`li`);
      const div = document.createElement(`div`);
      div.classList.add(`w-100`);
      div.classList.add(`d-flex`);
      div.classList.add(`justify-content-start`);

      const input = document.createElement(`input`);
      input.setAttribute(`name`, `axis-options`);
      input.setAttribute(`type`, `checkbox`);
      input.setAttribute(`value`, `${index}`);
      input.setAttribute(`id`, `axis-checkbox-${index}`);
      input.classList.add(`form-check-input`);
      input.classList.add(`me-1`);

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);
      label.classList.add(`text-capitalize`);
      label.classList.add(`text-break`);
      label.classList.add(`w-100`);
      label.setAttribute(`for`, `axis-checkbox-${index}`);

      current = current
        .substring(current.indexOf(`:`) + 1)
        .replace(/([A-Z])/g, ` $1`)
        .trim();
      const text = document.createTextNode(current);

      label.append(text);
      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`[axis-options]`).append(li);
    });
  }
}
