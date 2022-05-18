export class ErrorClass {
  constructor() {
    //
  }

  show(message: string, emptyFiling = false): void {
    const error = document.createElement(`sec-error`);
    error.setAttribute(`message`, message);
    document.querySelector(`#error-container`)?.appendChild(error);
    if (emptyFiling) {
      document.querySelector(`sec-filing`)?.classList.add(`d-none`);
    }
  }
}
