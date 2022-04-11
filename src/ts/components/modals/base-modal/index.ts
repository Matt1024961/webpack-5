import * as bootstrap from 'bootstrap';
import { StoreLogger } from '../../../store/logger';
import template from './template.html';

export class BaseModal extends HTMLElement {
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
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      storeLogger.info('Base Modal rendered');
    } else {
      storeLogger.error('Base Modal NOT rendered');
    }
  }

  listeners() {

    const thisModal = new bootstrap.Modal(this.querySelector(`#sec-modal`), {
      backdrop: false,
      keyboard: true,
    });
    thisModal.show();

    const modalClose = this.querySelector(`#modal-close`);
    const modalDrag = this.querySelector(`#modal-drag`);

    modalClose?.addEventListener(`click`, () => {
      thisModal.hide();
    });

    modalDrag?.addEventListener(`mousedown`, (event: DragEvent) => {
      this.dragging(this.querySelector(`#sec-modal`));
    })
  }

  dragging(element: Element): void {
    let selected = null;
    let xPosition = 0;
    let yPosition = 0;
    let xElement = 0;
    let yElement = 0;

    const drag = (element) => {
      xElement = (xPosition - selected.offsetLeft) + (selected.clientWidth / 2)
      yElement = (yPosition - selected.offsetTop) + (selected.clientHeight / 2);
    }

    console.log();
  }
}
