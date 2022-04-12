import * as bootstrap from 'bootstrap';

import { StoreLogger } from '../../../store/logger';
import template from './template.html';

export class BaseModal extends HTMLElement {
  constructor() {
    super();
  }

  // connectedCallback() {
  //   this.render();
  //   this.listeners();
  // }

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

  listeners(modalTitles: Array<string> = []) {
    console.log(modalTitles);
    const thisModal = new bootstrap.Modal(this.querySelector(`#sec-modal`), {
      backdrop: false,
      keyboard: true,
    });
    thisModal.show();

    const modalCarousel = this.querySelector(`#modal-carousel`);

    const modalClose = this.querySelector(`#modal-close`);

    const modalTitle = this.querySelector(`[sec-modal-title]`);

    const span = document.createElement(`span`);
    const modalTitleText = document.createTextNode(modalTitles[0]);
    span.append(modalTitleText);
    modalTitle.firstElementChild.replaceWith(span);

    modalCarousel.addEventListener(
      'slide.bs.carousel',
      (event: CarouselEvent) => {
        const oldActiveIndicator = this.querySelector(
          `[data-bs-slide-to="${event.from}"]`
        );
        const newActiveIndicator = this.querySelector(
          `[data-bs-slide-to="${event.to}"]`
        );

        oldActiveIndicator?.classList.remove(`active`);
        newActiveIndicator?.classList.add(`active`);

        const span = document.createElement(`span`);
        const modalTitleText = document.createTextNode(modalTitles[event.to]);
        span.append(modalTitleText);

        modalTitle.firstElementChild.replaceWith(span);
      }
    );

    modalClose?.addEventListener(`click`, () => {
      thisModal.hide();
    });

    this.initDragging(
      this.querySelector(`#modal-drag`),
      this.querySelector(`#sec-modal`)
    );
  }

  initDragging(elementToClick: HTMLElement, elementToDrag: HTMLElement): void {
    let dragStartX: number, dragStartY: number;
    let objInitLeft: number, objInitTop: number;
    let inDrag = false;

    elementToClick.addEventListener('mousedown', (event) => {
      inDrag = true;
      objInitLeft = elementToDrag.offsetLeft;
      objInitTop = elementToDrag.offsetTop;
      dragStartX = event.pageX;
      dragStartY = event.pageY;
    });

    document.addEventListener('mousemove', (event) => {
      if (!inDrag) {
        return;
      }
      elementToDrag.style.left = objInitLeft + event.pageX - dragStartX + 'px';
      elementToDrag.style.top = objInitTop + event.pageY - dragStartY + 'px';
    });

    document.addEventListener('mouseup', function () {
      inDrag = false;
    });
  }
}
