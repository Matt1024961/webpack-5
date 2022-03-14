import { Logger } from 'typescript-logger';

export class Xhtml {
  private logger: Logger;
  private url: string;
  constructor(url: string, xhtml: string, logger: Logger) {
    this.url = `${new URL(url, document.baseURI).href.substring(
      0,
      new URL(url, document.baseURI).href.lastIndexOf(`/`)
    )}`;
    this.logger = logger;
    this.init(xhtml);
  }
  init(xhtml: string): void {
    // we set the xhtml string to a nodelist

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(xhtml, `application/xhtml+xml`);
    const temp = htmlDoc.querySelector(`body`);
    let node = document.importNode(temp, true);
    // we now fix the XHTML
    node = this.fixXhtml(node);
    // we now update the XHTML
    node = this.updateXhtml(node);
    // we now add the XHTML to the document
    this.render(node);
  }

  fixXhtml(node: HTMLBodyElement): HTMLBodyElement {
    node.querySelectorAll(`[href]`).forEach((current) => {
      this.fixURL(current);
    });
    return node;
  }

  fixURL(current: Element): void {
    const href = current.getAttribute(`href`);
    if (href.startsWith(`http`)) {
      // console.log(href);
      current.setAttribute(`tabiindex`, `-1`);
    }
  }

  updateXhtml(node: HTMLBodyElement): HTMLBodyElement {
    node.querySelectorAll(`[contextRef]`).forEach((current) => {
      // we wrap every fact in: <span class="active-fact"><FACT></FACT></span>
      const wrapper = document.createElement(`span`);
      wrapper.classList.add(`active-fact`);
      current.parentNode.appendChild(wrapper);
      wrapper.appendChild(current);
      // add all event listeners
      current.addEventListener(`click`, (event) => {
        console.log(event);
        console.log(this);
      });
    });
    return node;
  }

  render(node: HTMLBodyElement): void {
    document.querySelector(`#filing`).append(node);
    document.querySelector(`#active-fact-count`).innerHTML = node
      .querySelectorAll(`[contextRef]`)
      .length.toString();

    this.logger.info(
      `XHTML Filing rendered with ${node.querySelectorAll(`[contextRef]`).length
      } facts`
    );
  }
}
