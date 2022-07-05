//import { Attributes } from '../../store/attributes';
import { ConstantApplication } from '../../constants/application';
import { Attributes } from '../../attributes';
import { StoreLogger } from '../../../logger';
import { StoreXhtml } from '../../xhtml';
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
    ConstantApplication.removeChildNodes(this);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        this.append(node);
        this.logger.info('Filing Loading Screen rendered');
      }
    } else {
      this.logger.warn('Filing Loading Screen rendered');
    }
  }

  render(): void {
    const storeXhtml: StoreXhtml = StoreXhtml.getInstance();
    this.replaceChildren(storeXhtml.node);
    this.logger.info(`Filing rendered`);
    new Attributes(true);
    //attributes.setProperAttribute();
  }

  listeners() {
    //
  }
}
