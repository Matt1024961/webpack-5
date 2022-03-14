import template from './template.html';

export class Data extends HTMLElement {
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
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      //this.logger.info('Data Filter Bar rendered');
    } else {
      //this.logger.warn('Data Filter NOT rendered');
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
