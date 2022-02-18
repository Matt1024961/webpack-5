import { Logger } from 'typescript-logger';

export class FilingUrl {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
    this.init();
  }

  init(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    for (const property in params) {
      if (property === `doc` || property === `file`) {
        // http://localhost:3000/?doc=/assets/example-1/fy19clx10k.htm
        fetch(params[property])
          .then((response) => {
            return response.text();
          })
          .then((data) => (document.querySelector(`#filing`).innerHTML = data));
      }
    }
    this.logger.info('Filing URL');
  }
}
