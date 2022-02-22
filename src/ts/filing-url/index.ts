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
          .then((data) => {
            // send this data somewhere to be processed
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, `application/xhtml+xml`);
            const temp = htmlDoc.querySelector(`body`);
            const node = document.importNode(temp, true);
            // we should now fix the XHTML
            node.querySelectorAll(`[contextRef]`).forEach((current, index) => {
              current.classList.add("active-fact");
            })
            document.querySelector(`#filing`).innerHTML = node.innerHTML;
            console.log(params[property]);
            const dataJson = `${params[property].substring(0, params[property].lastIndexOf(`/`))}/Data.json`;
            fetch(dataJson)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                // send this data somewhere to be processed

                console.log(data.facts);
              });
          });
      }
    }
    this.logger.info('Filing URL');
  }
}
