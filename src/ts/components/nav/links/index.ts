import Database from '../../../database';
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
      this.listeners();
    }
  }

  async update() {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const db: Database = new Database(storeUrl.dataURL);
    const files = (await db.isMultiFiling()) as Array<string>;
    console.log(files);
    files.forEach((current, index) => {
      console.log(current);

      const li = document.createElement(`li`);
      li.classList.add(`my-1`);

      const div = document.createElement(`div`);
      div.classList.add(`form-check`);

      const input = document.createElement(`input`);
      input.classList.add(`form-check-input`);
      input.setAttribute(`name`, `links-radios`);
      input.setAttribute(`type`, `radio`);
      input.setAttribute(`value`, `${index}`);
      input.setAttribute(`checked`, `false`);

      const label = document.createElement(`label`);
      label.classList.add(`form-check-label`);

      const text = document.createTextNode(current);

      label.append(text);

      div.append(input);
      div.append(label);
      li.append(div);

      this.querySelector(`fieldset`).append(li);
    });

    //     <label class="form-check-label" for="data-radio-0"> All </label>
    //   </div>
    // </li>
    console.log(this);
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
    const inputs = document.querySelectorAll('[name="data-radios"]');
    if (inputs) {
      inputs.forEach((current) => {
        current.addEventListener(`change`, () => {
          console.log(current.getAttribute(`value`));
        });
      });
    }
  }
}
