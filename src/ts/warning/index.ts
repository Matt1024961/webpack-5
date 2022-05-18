export class WarningClass {
  constructor() {
    //
  }

  show(message: string) {
    const warning = document.createElement(`sec-warning`);
    warning.setAttribute(`message`, message);
    document.querySelector(`#warning-container`)?.appendChild(warning);
  }
}
