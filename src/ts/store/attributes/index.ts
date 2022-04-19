import { Database } from '../../database';
//import { StoreData } from '../data';
import { StoreFilter } from '../filter';
import { StoreLogger } from '../logger';

export class Attributes {
  constructor() {
    //
  }

  async setProperAttribute() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();

    this.addAttributes(
      storeFilter.search ? true : false,
      storeFilter.isFilterActive()
    );
    // if (storeFilter.search) {
    //   // user has entered something into the search bar
    //   this.setHighlightedFact();
    // } else if (storeFilter.isFilterActive()) {
    //   // console.log(`set actives!`);
    //   // some filters applied, apply attribute when fact is on screen
    //   this.setActiveFilteredFact(storeFilter.search ? true : false);
    // } else {
    //   // console.log(`make it simple!`);
    //   // no filters applied, apply attribute when fact is on screen
    //   this.setActiveFact(storeFilter.search ? true : false);
    // }
  }
  async addAttributes(activeSearch: boolean, activeFilter: boolean) {
    // console.log(activeSearch);
    // console.log(activeFilter);
    const db = new Database();
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    for await (const element of allFacts) {
      const isInViewPort = this.isInViewPort(element);
      const isfactHidden = await db.isFactHidden(element.id);
      const isFactActive = await db.isFactActive(element.id);
      if (isInViewPort && !isfactHidden) {
        // we ONLY do anything if the fact is in the view port, otherwise, who cares (right now)
        // we ONLY do anything if the fact has `isHidden` set to FALSE (right now)
        if (activeSearch) {
          // we want to  add [highlight-fact] to the elements that have `isHighlight`
          if (activeFilter) {
            //
          } else {
            console.log(element);
          }
        } else if (!activeSearch && activeFilter) {
          // we want to add [active-fact] to the elements that have `isActive`
          if (activeFilter && isFactActive) {
            //
            element.setAttribute(`active-fact`, ``);
          } else {
            console.log(`remove!!!`);
            element.removeAttribute(`active-fact`);
            element.removeAttribute(`highlight-fact`);
          }
        } else {
          console.log(activeSearch);
          console.log(activeFilter);
          element.setAttribute(`active-fact`, ``);
        }
      } else {
        console.log(activeSearch);
        console.log(activeFilter);
        element.removeAttribute(`active-fact`);
        element.removeAttribute(`highlight-fact`);
      }
    }
  }

  async setHighlightedFact(): Promise<void> {
    const db = new Database();
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    const visibleFacts = { count: 0 };

    for await (const element of allFacts) {
      //allFacts.forEach(async (element: Element) => {
      if (
        this.isInViewPort(element) &&
        (await db.isFactHighlighted(element.id)) &&
        !(await db.isFactHidden(element.id))
      ) {
        visibleFacts.count++;
        element.setAttribute(`highlight-fact`, ``);
        element.addEventListener(`click`, (event) => {
          console.log(event);
          console.log(this);
        });
      } else {
        element.removeAttribute(`highlight-fact`);
      }
    }

    // dear Matt, remove these two lines below
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    storeLogger.log(
      `Visible Highlighted Facts in ViewPort: ${visibleFacts.count}`
    );
  }

  async setActiveFact(highlight: boolean): Promise<void> {
    const db = new Database();
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    const visibleFacts = { count: 0 };
    allFacts.forEach(async (element: Element) => {
      if (this.isInViewPort(element) && !(await db.isFactHidden(element.id))) {
        visibleFacts.count++;
        if (!highlight) {
          element.removeAttribute(`highlight-fact`);
        }
        if (await db.isFactText(element.id)) {
          element.setAttribute(`active-fact-block`, ``);
        } else {
          element.setAttribute(`active-fact`, ``);
        }

        element.addEventListener(`click`, (event) => {
          console.log(event);
          console.log(this);
        });
      } else {
        element.removeAttribute(`active-fact`);
      }
    });

    // dear Matt, remove these two lines below
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    storeLogger.log(`Visible Active Facts in ViewPort: ${visibleFacts.count}`);
  }

  async setActiveFilteredFact(highlight: boolean): Promise<void> {
    const db = new Database();
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    const visibleFacts = { count: 0 };
    allFacts.forEach(async (element: Element) => {
      if (
        this.isInViewPort(element) &&
        (await db.isFactActive(element.id)) &&
        !(await db.isFactHidden(element.id))
      ) {
        visibleFacts.count++;
        if (!highlight) {
          element.removeAttribute(`highlight-fact`);
        }
        if (await db.isFactText(element.id)) {
          element.setAttribute(`active-fact-block`, ``);
        } else {
          element.setAttribute(`active-fact`, ``);
        }
        element.addEventListener(`click`, (event) => {
          console.log(event);
          console.log(this);
        });
      } else {
        element.removeAttribute(`active-fact`);
      }
    });

    // dear Matt, remove these two lines below
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    storeLogger.log(
      `Visible Active Filtered Facts in ViewPort: ${visibleFacts.count}`
    );
  }

  isInViewPort = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
}
