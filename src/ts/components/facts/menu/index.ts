import template from './template.html';

export class FactsMenu extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.render();
    this.listeners();
  }

  async render() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        this.append(node);
        //this.logger.info('Facts Menu rendered');
      }
    } else {
      //this.logger.warn('Facts Menu NOT rendered');
    }
  }

  listeners(): void {
    const offcanvas = document.querySelector('#facts-offcanvas');
    if (offcanvas) {
      const tagsToAlter = [
        `#error-container`,
        `#warning-container`,
        `#filing-container`,
      ];
      offcanvas.addEventListener('show.bs.offcanvas', () => {
        if (!document.querySelector(`sec-facts-menu-pagination`)) {
          // add <sec-facts-menu-pagination></sec-facts-menu-single>
          const pagination = document.createElement(
            `sec-facts-menu-pagination`
          );
          this.querySelector(`#facts-offcanvas .offcanvas-body`)?.append(
            pagination
          );
        }
        tagsToAlter.forEach((current) => {
          const tag = document.querySelector(current) as HTMLElement;
          if (tag) {
            Object.assign(tag.style, {
              marginRight: `400px`,
              transition: `margin 100ms`,
            });
          }
        });
      });
      offcanvas.addEventListener('hidden.bs.offcanvas', () => {
        tagsToAlter.forEach((current) => {
          const tag = document.querySelector(current) as HTMLElement;
          if (tag) {
            Object.assign(tag.style, {
              marginRight: `0px`,
              transition: `margin 100ms`,
            });
          }
        });
      });
    }
  }
}
