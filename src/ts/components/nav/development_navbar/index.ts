import template from './template.html';

export class DevelopmentNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.init();
  }

  init(): void {
    fetch(`./assets/development-locations.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.render(data);
      });
  }
  render(
    developmentData: { single: Array<string>; multi: Array<string> }
  ) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (
      htmlDoc.querySelector(`[template]`)
    ) {
      const selector = htmlDoc.querySelector(`[template]`);
      const node = document.importNode(selector, true);
      node.removeAttribute(`template`);
      developmentData.single.forEach((current) => {
        const list = node.querySelector(`[single]`);
        const li = document.createElement(`li`);
        const a = document.createElement(`a`);
        a.setAttribute(`class`, `dropdown-item`);
        a.setAttribute(`href`, `?doc=/assets/example-1/${current[0]}`);
        a.setAttribute(`target`, `_blank`);
        const text = document.createTextNode(current[0]);
        list.appendChild(li).appendChild(a).appendChild(text);
      });
      developmentData.multi.forEach((current) => {
        const list = node.querySelector(`[multi]`);
        const li = document.createElement(`li`);
        const a = document.createElement(`a`);
        a.setAttribute(`class`, `dropdown-item`);
        a.setAttribute(`href`, `?doc=/assets/example-1/${current[0]}`);
        a.setAttribute(`target`, `_blank`);
        const text = document.createTextNode(current[0]);
        list.appendChild(li).appendChild(a).appendChild(text);
      });
      this.append(node);
      // this.logger.info('Development Navigation Bar rendered');
    } else {
      //  this.logger.warn('Development Navigation Bar NOT rendered');
    }
  }
}
