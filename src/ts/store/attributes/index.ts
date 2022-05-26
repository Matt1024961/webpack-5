// import Database from '../../indexedDB/facts';
// import { StoreFilter } from '../filter';
// import { StoreUrl } from '../url';

import { getAllFacts } from '../../redux/reducers/facts';

export class Attributes {
  constructor() {
    //
  }

  async setProperAttribute() {
    const allFacts = getAllFacts();
    allFacts.forEach((fact) => {
      const isfactHidden = fact.isHidden;
      const isFactActive = fact.isActive;
      const isFactHighlight = fact.isHighlight;
      const isFactBlock = fact.isHtml || fact.isText;
      if (!isfactHidden && document.getElementById(fact.id as string)) {
        if (isFactActive) {
          if (isFactBlock) {
            const element = document.getElementById(fact.id as string);

            element?.setAttribute(`active-fact-block`, ``);

            const spanL = document.createElement(`span`);
            spanL.classList.add(`float-left`);
            spanL.classList.add(`position-absolute`);
            spanL.classList.add(`block-indicator-left`);

            const spanR = document.createElement(`span`);
            spanR.classList.add(`float-right`);
            spanR.classList.add(`position-absolute`);
            spanR.classList.add(`block-indicator-right`);
            element?.parentNode?.insertBefore(spanR, element);
            element?.parentNode?.insertBefore(spanL, element);
          } else {
            document
              .getElementById(fact.id as string)
              ?.setAttribute(`active-fact`, ``);
          }
        } else if (!isFactActive) {
          document
            .getElementById(fact.id as string)
            ?.removeAttribute(`active-fact`);
        }
        if (isFactHighlight) {
          document
            .getElementById(fact.id as string)
            ?.setAttribute(`highlight-fact`, ``);
        } else if (!isFactHighlight) {
          document
            .getElementById(fact.id as string)
            ?.removeAttribute(`highlight-fact`);
        }
      }
    });
    // const storeFilter: StoreFilter = StoreFilter.getInstance();
    // const storeUrl: StoreUrl = StoreUrl.getInstance();
    // const db: Database = new Database(storeUrl.dataURL);
    // const allDBFacts = await db.getAllFacts();

    // allDBFacts.forEach((current) => {
    //   const isfactHidden = current.isHidden;
    //   const isFactActive = storeFilter.active.includes(current.htmlId);
    //   const isFactHighlight = storeFilter.highlight.includes(current.htmlId);
    //   const isFactBlock = current.isHtml || current.isText;

    //   if (!isfactHidden && document.getElementById(current.htmlId)) {
    //     if (isFactActive) {
    //       if (isFactBlock) {
    //         const element = document.getElementById(current.htmlId);

    //         element?.setAttribute(`active-fact-block`, ``);

    //         const spanL = document.createElement(`span`);
    //         spanL.classList.add(`float-left`);
    //         spanL.classList.add(`position-absolute`);
    //         spanL.classList.add(`block-indicator-left`);

    //         const spanR = document.createElement(`span`);
    //         spanR.classList.add(`float-right`);
    //         spanR.classList.add(`position-absolute`);
    //         spanR.classList.add(`block-indicator-right`);
    //         element?.parentNode?.insertBefore(spanR, element);
    //         element?.parentNode?.insertBefore(spanL, element);
    //       } else {
    //         document
    //           .getElementById(current.htmlId)
    //           ?.setAttribute(`active-fact`, ``);
    //       }
    //     } else if (!isFactActive) {
    //       document
    //         .getElementById(current.htmlId)
    //         ?.removeAttribute(`active-fact`);
    //     }
    //     if (isFactHighlight) {
    //       document
    //         .getElementById(current.htmlId)
    //         ?.setAttribute(`highlight-fact`, ``);
    //     } else if (!isFactHighlight) {
    //       document
    //         .getElementById(current.htmlId)
    //         ?.removeAttribute(`highlight-fact`);
    //     }
    //   }
    // });
  }
}
