import { Attributes } from '../../store/attributes';
import { StoreLogger } from '../../store/logger';
import template from './template.html';

export class Filing extends HTMLElement {
  private logger: StoreLogger;
  static get observedAttributes() {
    return [`xhtml`];
  }

  constructor() {
    super();
    this.logger = StoreLogger.getInstance();
  }

  connectedCallback() {
    this.loading();
  }

  disconnectedCallback() {
    //
  }

  adoptedCallback() {
    //
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === `xhtml` && newValue) {
      this.render(newValue);
      this.listeners();
      this.removeAttribute(`xhtml`);
    }
  }

  loading(): void {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      this.append(node);
      this.logger.info('Filing Loading Screen rendered');
    } else {
      this.logger.warn('Filing Loading Screen rendered');
    }
  }

  render(xhtml: string): void {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(xhtml, `application/xhtml+xml`);

    const temp = htmlDoc.querySelector(`body`);
    const node = document.importNode(temp, true);

    this.replaceWith(node);
    this.logger.info(`Filing rendered`);
  }

  listeners() {
    const attributes = new Attributes();
    attributes.setProperAttribute();
    document.addEventListener('scroll', () => {
      attributes.setProperAttribute();
    });
  }
}
