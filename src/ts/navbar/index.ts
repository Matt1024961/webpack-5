const template = require('./template.html').default;

export class Navbar {
  constructor(querySelector: string) {
    this.render(querySelector);
  }
  render(querySelector: string) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    const temp = htmlDoc.querySelector(`#template`);
    const node = document.importNode(temp, true);
    document.body.querySelector(querySelector).innerHTML = node.innerHTML;
  }
}
