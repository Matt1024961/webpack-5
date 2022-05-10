import Database from '../../indexedDB/facts';
import { StoreFilter } from '../filter';
import { StoreUrl } from '../url';

export class Attributes {
  constructor() {
    //
  }

  async setProperAttribute() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const db: Database = new Database(storeUrl.dataURL);
    const allDBFacts = await db.getAllFacts();
    allDBFacts.forEach((current) => {
      const isfactHidden = current.isHidden;
      const isFactActive = storeFilter.active.includes(current.htmlId);
      const isFactHighlight = storeFilter.highlight.includes(current.htmlId);
      const isFactBlock = current.isHtml || current.isText;

      if (!isfactHidden && document.getElementById(current.htmlId)) {
        if (isFactActive) {
          if (isFactBlock) {
            const element = document.getElementById(current.htmlId);

            element.setAttribute(`active-fact-block`, ``);

            const spanL = document.createElement(`span`);
            spanL.classList.add(`float-left`);
            spanL.classList.add(`position-absolute`);
            spanL.classList.add(`block-indicator-left`);

            const spanR = document.createElement(`span`);
            spanR.classList.add(`float-right`);
            spanR.classList.add(`position-absolute`);
            spanR.classList.add(`block-indicator-right`);
            element.parentNode.insertBefore(spanR, element);
            element.parentNode.insertBefore(spanL, element);
          } else {
            document
              .getElementById(current.htmlId)
              .setAttribute(`active-fact`, ``);
          }
        } else if (!isFactActive) {
          document
            .getElementById(current.htmlId)
            .removeAttribute(`active-fact`);
        }
        if (isFactHighlight) {
          document
            .getElementById(current.htmlId)
            .setAttribute(`highlight-fact`, ``);
        } else if (!isFactHighlight) {
          document
            .getElementById(current.htmlId)
            .removeAttribute(`highlight-fact`);
        }
      }
    });

    // for await (const element of allFacts) {
    //   const isfactHidden = await db.isFactHidden(element.id);
    //   const isFactActive = await db.isFactActive(element.id);
    //   const isFactHighlight = await db.isFactHighlighted(element.id);

    //   if (!isfactHidden) {
    //     if (isFactActive) {
    //       element.setAttribute(`active-fact`, ``);
    //     } else if (!isFactActive) {
    //       element.removeAttribute(`active-fact`);
    //     }
    //     if (isFactHighlight) {
    //       element.setAttribute(`highlight-fact`, ``);
    //     } else if (!isFactHighlight) {
    //       element.removeAttribute(`highlight-fact`);
    //     }
    //   }
    // }
  }
}
