import * as bootstrap from 'bootstrap';
import { ConstantApplication } from '../../../constants/application';

import { StoreLogger } from '../../../store/logger';
import template from './template.html';

export class BaseModal extends HTMLElement {
  constructor() {
    super();
  }

  init(modalTitles: Array<string> = []) {
    this.render(modalTitles);
    this.listeners(modalTitles);
  }
  render(modalTitles: Array<string> = []) {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);

      const indicatorLinks = this.querySelector(`[indicator-links]`);
      modalTitles.forEach((current, index) => {
        const a = document.createElement(`a`);
        a.setAttribute(`type`, `button`);
        a.setAttribute(`data-bs-target`, `#modal-carousel`);
        a.setAttribute(`data-bs-slide-to`, `${index}`);
        a.setAttribute(`aria-label`, current);
        if (index === 0) {
          a.classList.add(`active`);
          a.setAttribute(`aria-current`, `true`);
        }
        indicatorLinks.append(a);
      });
      storeLogger.info('Base Modal rendered');
    } else {
      storeLogger.error('Base Modal NOT rendered');
    }
  }

  listeners(modalTitles: Array<string> = []) {
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
      ConstantApplication.removeChildNodes(
        document.querySelector(`#modal-container`)
      );
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
