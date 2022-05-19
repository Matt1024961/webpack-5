import { ConstantApplication } from '../../../constants/application';
import { StoreLogger } from '../../../store/logger';
import template from './template.html';

export class Menu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.listeners();
  }

  render() {
    const storeLogger: StoreLogger = StoreLogger.getInstance();

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const textToAdd = document.createTextNode(ConstantApplication.version);
        node.querySelector(`[template-version]`)?.appendChild(textToAdd);
        node.removeAttribute(`template-version`);
        this.append(node);
        storeLogger.info('Menu Button rendered');
      }
    } else {
      storeLogger.error('Menu Button NOT rendered');
    }
  }

  listeners() {
    const modal = this.querySelectorAll(`[modal]`);
    modal.forEach((current) => {
      current.addEventListener(`click`, () => {
        this.modal(current.getAttribute(`modal`) as string);
      });
    });
  }

  modal(modalType: string): void {
    switch (modalType) {
      case `information`: {
        const modal = document.createElement(`sec-modal-information`);
        document.querySelector(`#modal-container`)?.append(modal);
        break;
      }
      case `settings`: {
        const modal = document.createElement(`sec-modal-settings`);
        document.querySelector(`#modal-container`)?.append(modal);
        break;
      }
      default: {
        console.log(`error!`);
      }
    }
  }
}
