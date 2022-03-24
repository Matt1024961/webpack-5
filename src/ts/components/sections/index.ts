import template from './template.html';

export class SectionsMenu extends HTMLElement {
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
    const offcanvas = document.querySelector('#sections-offcanvas');
    if (offcanvas) {
      const tagsToAlter = [`sec-error`, `sec-warning`, `#filing-container`];
      offcanvas.addEventListener('show.bs.offcanvas', function () {
        tagsToAlter.forEach((current) => {
          const tag = document.querySelector(current) as HTMLElement;
          if (tag) {
            Object.assign(tag.style, {
              marginLeft: `400px`,
              transition: `margin 100ms`,
            });
          }
        });
      });
      offcanvas.addEventListener('hidden.bs.offcanvas', function () {
        tagsToAlter.forEach((current) => {
          const tag = document.querySelector(current) as HTMLElement;
          if (tag) {
            Object.assign(tag.style, {
              marginLeft: `0px`,
              transition: `margin 100ms`,
            });
          }
        });
      });
    }
  }
}
