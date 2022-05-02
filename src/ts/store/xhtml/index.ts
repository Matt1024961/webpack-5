import { StoreUrl } from '../url';

export class StoreXhtml {
  private _node: HTMLBodyElement;
  private static instance: StoreXhtml;
  private constructor() {
    //
  }

  public static getInstance(): StoreXhtml {
    if (!StoreXhtml.instance) {
      StoreXhtml.instance = new StoreXhtml();
    }
    return StoreXhtml.instance;
  }

  public get node() {
    return this._node;
  }
  public set node(input) {
    // we set the xhtml string to a HTMLBodyElement
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      input as unknown as string,
      `text/html`
    );

    const temp = htmlDoc.querySelector(`body`);
    let node = document.importNode(temp, true);
    node = this.updateHref(node);
    node = this.updateSrc(node);
    this._node = node;
  }

  updateHref(node: HTMLBodyElement): HTMLBodyElement {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    node.querySelectorAll(`[href]`).forEach((current) => {
      const href = current.getAttribute(`href`);
      current.setAttribute(`tabiindex`, `-1`);
      if (
        href.startsWith(`#`) ||
        href.startsWith(`http://`) ||
        href.startsWith(`https://`)
      ) {
        // these are an anchor tag
        // OR
        // these are already an absolute value
      } else {
        // update href to absolute url
        current.setAttribute(`href`, `${storeUrl.baseURL}${href}`);
      }
    });
    return node;
  }

  updateSrc(node: HTMLBodyElement): HTMLBodyElement {
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    node.querySelectorAll(`[src]`).forEach((current) => {
      const src = current.getAttribute(`src`);
      if (src.startsWith(`http://`) || src.startsWith(`https://`)) {
        // these are already an absolute value
      } else {
        // update src to absolute url
        current.setAttribute(`src`, `${storeUrl.baseURL}${src}`);
      }
    });
    return node;
  }
}
