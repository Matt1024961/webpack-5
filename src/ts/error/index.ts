export class ErrorClass {

  constructor() {
    //
  }

  show(message: string): void {
    const error = document.createElement(`sec-error`);
    error.setAttribute(`message`, message);
    document.querySelector(`#error-container`).appendChild(error);
  }
}
