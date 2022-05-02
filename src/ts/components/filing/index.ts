//import { Attributes } from '../../store/attributes';
import { ConstantApplication } from '../../constants/application';
import { Attributes } from '../../store/attributes';
import { StoreLogger } from '../../store/logger';
import { StoreXhtml } from '../../store/xhtml';
import template from './template.html';

export class Filing extends HTMLElement {
  private logger: StoreLogger;
  static get observedAttributes() {
    return [`update`, `reset`];
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
    if (name === `update` && newValue) {
      this.render();
      this.listeners();
      this.removeAttribute(`xhtml`);
    }
    if (name === `reset` && newValue) {
      this.loading();
      this.removeAttribute(`reset`);
    }
  }

  loading(): void {
    console.log(`LOADING`);
    ConstantApplication.removeChildNodes(this);
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

  render(): void {
    const storeXhtml: StoreXhtml = StoreXhtml.getInstance();
    this.replaceChildren(storeXhtml.node);
    this.logger.info(`Filing rendered`);
    const attributes = new Attributes();
    attributes.setProperAttribute();
  }

  listeners() {
    //
  }
}
