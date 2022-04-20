import { Database } from '../../database';
//import { StoreData } from '../data';
// import { StoreFilter } from '../filter';
//import { StoreLogger } from '../logger';

export class Attributes {
  constructor() {
    //
  }

  async setProperAttribute() {
    const db = new Database();
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    for await (const element of allFacts) {
      const isfactHidden = await db.isFactHidden(element.id);
      const isFactActive = await db.isFactActive(element.id);
      const isFactHighlight = await db.isFactHighlighted(element.id);

      if (!isfactHidden) {
        if (isFactActive) {
          element.setAttribute(`active-fact`, ``);
        } else if (!isFactActive) {
          element.removeAttribute(`active-fact`);
        }
        if (isFactHighlight) {
          element.setAttribute(`highlight-fact`, ``);
        } else if (!isFactHighlight) {
          element.removeAttribute(`highlight-fact`)
        }
      }
    }
  }
}
