import Database from '../../../indexedDB/facts';
import { ErrorClass } from '../../../error';
import { StoreFilter } from '../../../store/filter';
import { Scale } from '../../../store/scale';
import { StoreUrl } from '../../../store/url';
import { moreFilters } from '../../../types/filter';
import template from './template.html';
import { ConstantApplication } from '../../../constants/application';

export class MoreFilters extends HTMLElement {
  private populated = false;
  static get observedAttributes() {
    return [`reset`, `empty`];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === `reset` && newValue) {
      this.reset();
      this.removeAttribute(`reset`);
    }
    if (name === `empty` && newValue) {
      this.empty();
      this.removeAttribute(`empty`);
    }
  }

  reset() {
    const inputs = this.querySelectorAll('[type="checkbox"]:checked');
    inputs.forEach((current) => {
      (current as HTMLInputElement).checked = false;
    });
    const resetFilter: moreFilters = {
      periods: [],
      measures: [],
      axis: [],
      members: [],
      scale: [],
      balance: [],
    };
    this.updateNotification(resetFilter);
    // the event will occur in ResetAllFilters
  }

  empty() {
    ConstantApplication.removeChildNodes(this);
    this.populated = false;
    this.render();
    this.listeners();
    this.querySelector(`.nav-link`).classList.remove(`disabled`);
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
          if (
            name === `balance-options` ||
            name === `axis-options` ||
            name === `members-options` ||
            name === `periods-options`
          ) {
            return current.getAttribute(`value`);
          } else {
            return parseInt(current.getAttribute(`value`), 10);
          }
        }),
      };
      const updatedFilter = Object.assign(
        storeFilter.moreFilters,
        userSelectedCheckBoxes
      );
      storeFilter.moreFilters = updatedFilter;
      this.updateNotification(updatedFilter);
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

      totalCheckBoxes.forEach((checkbox: HTMLInputElement, index) => {
        checkbox.checked = checkAllBoxes;
        if (index === totalCheckBoxes.length - 1) {
          const event = new Event('change');
          checkbox.dispatchEvent(event);
        }
      });
    } else {
      const error = new ErrorClass();
      error.show(
        `An internal error has occured, the option you have selected does not exsist.`
      );
    }
  }

  updateNotification(userFilters: moreFilters): void {
    const filtersActive = Object.values(userFilters).reduce(
      (accumulator, current) => {
        return (accumulator += current.length);
      },
      0
    );
    if (filtersActive > 0) {
      this.querySelector(`.nav-link [filter-count]`)?.remove();
      const span = document.createElement(`span`);
      span.setAttribute(`filter-count`, ``);
      span.classList.add(`badge`);
      span.classList.add(`bg-warning`);
      span.classList.add(`text-dark`);

      const text = document.createTextNode(`${filtersActive}`);

      span.append(text);
      this.querySelector(`.nav-link`).append(span);
      this.querySelector(`.nav-link`).classList.add(`text-warning`);
    } else {
      this.querySelector(`.nav-link`).classList.remove(`text-warning`);
      this.querySelector(`.nav-link [filter-count]`)?.remove();
    }
  }

  async populateDropdownOptions() {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const db: Database = new Database(storeUrl.dataURL);
    await this.populatePeriods(db, storeUrl);
    await this.populateAxes(db, storeUrl);
    await this.populateMembers(db, storeUrl);
    await this.populateScale(db, storeUrl);
    await this.populateBalance(db, storeUrl);
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

  async populatePeriods(db: Database, storeUrl: StoreUrl) {
    const periods = (await db.getAllUniquePeriods(
      storeUrl.filing
    )) as Array<string>;
    const regex = new RegExp(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
    const complexPeriods = periods.reduce(
      (accumulator: { [key: string]: Array<string> }, current) => {
        const date = new Date(current.match(regex)[0]).getFullYear();
        // eslint-disable-next-line no-prototype-builtins
        if (!accumulator.hasOwnProperty(date)) {
          accumulator[date] = [current];
        } else {
          accumulator[date].push(current);
        }
        return accumulator;
      },
      {}
    );
    const periodCount = document.createTextNode(`${periods.length}`);
    this.querySelector(`[period-count]`).firstElementChild.replaceWith(
      periodCount
    );

    Object.keys(complexPeriods)
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
          `${complexPeriods[current].length}`
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

        complexPeriods[current].forEach((currentNest) => {
          const div = document.createElement(`div`);
          div.classList.add(`w-100`);
          div.classList.add(`d-flex`);
          div.classList.add(`justify-content-start`);

          const input = document.createElement(`input`);
          input.setAttribute(`name`, `periods-options`);
          input.setAttribute(`type`, `checkbox`);
          input.setAttribute(`value`, `${currentNest}`);
          input.setAttribute(`id`, `periods-checkbox-${index}`);
          input.classList.add(`form-check-input`);
          input.classList.add(`me-1`);

          const label = document.createElement(`label`);
          label.setAttribute(`for`, `periods-checkbox-${index}`);
          label.classList.add(`form-check-label`);
          label.classList.add(`text-capitalize`);
          label.classList.add(`text-break`);
          label.classList.add(`w-100`);

          const text = document.createTextNode(`${currentNest}`);

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

  async populateBalance(db: Database, storeUrl: StoreUrl) {
    const filterBalance = (await db.getAllUniqueBalances(
      storeUrl.filing
    )) as Array<string>;

    const balanceCount = document.createTextNode(`${filterBalance.length}`);
    this.querySelector(`[balance-count]`).firstElementChild.replaceWith(balanceCount);

    filterBalance.forEach((current, index) => {
      const li = document.createElement(`li`);
      const div = document.createElement(`div`);
      div.classList.add(`w-100`);
      div.classList.add(`d-flex`);
      div.classList.add(`justify-content-start`);

      const input = document.createElement(`input`);
      input.setAttribute(`name`, `balance-options`);
      input.setAttribute(`type`, `checkbox`);
      input.setAttribute(`value`, `${current}`);
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

  async populateScale(db: Database, storeUrl: StoreUrl) {
    const filterScale = (await db.getAllUniqueScales(
      storeUrl.filing
    )) as Array<string>;

    const scaleCount = document.createTextNode(`${filterScale.length}`);
    this.querySelector(`[scale-count]`).firstElementChild.replaceWith(scaleCount);
    filterScale
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
        input.setAttribute(`value`, `${current}`);
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

  async populateMembers(db: Database, storeUrl: StoreUrl) {
    const filterMembers = (await db.getAllUniqueMembers(
      storeUrl.filing
    )) as unknown as Array<Array<string>>;
    // we remove any possible duplicates, flatten the array, remove the prefix (us-gaap, etc.) and sort
    const filterMembersSet = [
      ...new Set(
        filterMembers
          .flat()
          .map((current) => {
            return current;
          })
          .sort()
      ),
    ];
    const membersCount = document.createTextNode(`${filterMembersSet.length}`);
    this.querySelector(`[members-count]`).firstElementChild.replaceWith(membersCount);
    filterMembersSet.forEach((current, index) => {
      const li = document.createElement(`li`);
      const div = document.createElement(`div`);
      div.classList.add(`w-100`);
      div.classList.add(`d-flex`);
      div.classList.add(`justify-content-start`);

      const input = document.createElement(`input`);
      input.setAttribute(`name`, `members-options`);
      input.setAttribute(`type`, `checkbox`);
      input.setAttribute(`value`, `${current}`);
      input.setAttribute(`id`, `members-checkbox-${index}`);
      input.classList.add(`form-check-input`);
      input.classList.add(`me-1`);

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);
      label.classList.add(`text-capitalize`);
      label.classList.add(`text-break`);
      label.classList.add(`w-100`);
      label.setAttribute(`for`, `members-checkbox-${index}`);

      const text = document.createTextNode(
        `${current
          .substring(current.indexOf(`:`) + 1)
          .replace(/([A-Z])/g, ` $1`)
          .trim()}`
      );

      label.append(text);
      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`[members-options]`).append(li);
    });
  }

  async populateAxes(db: Database, storeUrl: StoreUrl) {
    const filterAxis = (await db.getAllUniqueAxes(
      storeUrl.filing
    )) as unknown as Array<Array<string>>;
    // we remove any possible duplicates, flatten the array, remove the prefix (us-gaap, etc.) and sort
    const filterAxisSet = [
      ...new Set(
        filterAxis
          .flat()
          .map((current) => {
            return current;
          })
          .sort()
      ),
    ];

    const axisCount = document.createTextNode(`${filterAxisSet.length}`);
    this.querySelector(`[axis-count]`).firstElementChild.replaceWith(axisCount);

    filterAxisSet.forEach((current, index) => {
      const li = document.createElement(`li`);
      const div = document.createElement(`div`);
      div.classList.add(`w-100`);
      div.classList.add(`d-flex`);
      div.classList.add(`justify-content-start`);

      const input = document.createElement(`input`);
      input.setAttribute(`name`, `axis-options`);
      input.setAttribute(`type`, `checkbox`);
      input.setAttribute(`value`, `${current}`);
      input.setAttribute(`id`, `axis-checkbox-${index}`);
      input.classList.add(`form-check-input`);
      input.classList.add(`me-1`);

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);
      label.classList.add(`text-capitalize`);
      label.classList.add(`text-break`);
      label.classList.add(`w-100`);
      label.setAttribute(`for`, `axis-checkbox-${index}`);

      const text = document.createTextNode(
        `${current
          .substring(current.indexOf(`:`) + 1)
          .replace(/([A-Z])/g, ` $1`)
          .trim()}`
      );

      label.append(text);
      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`[axis-options]`).append(li);
    });
  }
}
