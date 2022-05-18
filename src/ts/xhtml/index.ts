import { StoreUrl } from '../store/url';

export class Xhtml {
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  init(xhtml: string) {
    // we set the xhtml string to a nodelist
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(xhtml, `application/xhtml+xml`);

    const temp = htmlDoc.querySelector(`body`);
    if (temp) {
      let node = document.importNode(temp, true);
      // we now fix the XHTML
      node = this.fixXhtml(node);
      // we now update the XHTML
      return node;
    }
  }

  fixXhtml(node: HTMLBodyElement): HTMLBodyElement {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const src = storeUrl.filingURL.substring(
      0,
      storeUrl.filingURL.lastIndexOf('/')
    );
    // console.log(src);
    node.querySelectorAll(`[href]`).forEach((current) => {
      this.fixURL(current);
    });
    node.querySelectorAll(`[src]`).forEach((current) => {
      const currentSRC = current.getAttribute(`src`);
      current.setAttribute(`src`, `${src}/${currentSRC}`);

      //this.fixURL(current);
    });
    return node;
  }

  fixURL(current: Element): void {
    const href = current.getAttribute(`href`);
    if (href && href.startsWith(`http`)) {
      // console.log(href);
      current.setAttribute(`tabiindex`, `-1`);
    }
  }

  updateXhtml(node: HTMLBodyElement): HTMLBodyElement {
    node.querySelectorAll(`[contextRef]`).forEach((current) => {
      // we wrap every fact in: <span class="active-fact"><FACT></FACT></span>
      const wrapper = document.createElement(`span`);
      wrapper.classList.add(`active-fact`);
      current.parentNode?.appendChild(wrapper);
      wrapper.appendChild(current);
      // add all event listeners
      current.addEventListener(`click`, (event) => {
        console.log(event);
        console.log(this);
      });
    });
    return node;
  }
}
