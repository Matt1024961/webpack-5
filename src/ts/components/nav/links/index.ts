import Database from '../../../database';
import { FilingUrl } from '../../../filing-url';
import { StoreUrl } from '../../../store/url';
import template from './template.html';

export class Links extends HTMLElement {
  static get observedAttributes() {
    return [`multiple`];
  }
  constructor() {
    super();
  }
  connectedCallback() {
    //
    this.render();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === `multiple` && newValue === ``) {
      this.update();
      //this.listeners();
    }
  }

  async update() {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const db: Database = new Database(storeUrl.dataURL);
    const files = (await db.isMultiFiling()) as Array<string>;
    files.forEach((current) => {
      const li = document.createElement(`li`);
      li.classList.add(`my-1`);

      const div = document.createElement(`div`);
      div.classList.add(`form-check`);

      const input = document.createElement(`input`);
      input.classList.add(`form-check-input`);
      input.setAttribute(`name`, `link-radios`);
      input.setAttribute(`type`, `radio`);
      input.setAttribute(`value`, `${current}`);
      if (storeUrl.filing === current) {
        input.setAttribute(`checked`, ``);
        input.setAttribute(`disabled`, ``);
      }

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);

      const text = document.createTextNode(current);

      label.append(text);

      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`fieldset`).append(li);
    });
    this.listeners();
  }

  render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
    } else {
      //
    }
  }

  listeners(): void {
    const inputs = this.querySelectorAll('[name="link-radios"]');
    if (inputs) {
      inputs.forEach((current) => {
        current.addEventListener(`change`, () => {
          this.linkOptionChange(current.getAttribute(`value`));
        });
      });
    }
  }

  linkOptionChange(input: string) {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    if (storeUrl.filing !== input) {
      new FilingUrl(input);
    }
  }
}
