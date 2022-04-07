import { StoreData } from '../data';
import { StoreFilter } from '../filter';
import { StoreLogger } from '../logger';

export class Attributes {
  constructor() {
    //
  }

  setProperAttribute() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    if (storeFilter.search) {
      // user has entered something into the search bar
      this.setHighlightedFact();
    }
    if (storeFilter.isFilterActive()) {
      // some filters applied, apply attribute when fact is on screen
      this.setActiveFilteredFact();
    } else {
      // no filters applied, apply attribute when fact is on screen
      this.setActiveFact();
    }
  }

  setHighlightedFact(): void {
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    const visibleFacts = { count: 0 };

    allFacts.forEach((element: Element) => {
      if (
        this.factIsHighlighted(element.id) &&
        this.isInViewPort(element) &&
        !this.isHidden(element.id)
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
    });

    // dear Matt, remove these two lines below
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    storeLogger.log(
      `Visible Highlighted Facts in ViewPort: ${visibleFacts.count}`
    );
  }

  setActiveFact(): void {
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    const visibleFacts = { count: 0 };

    allFacts.forEach((element: Element) => {
      if (this.isInViewPort(element) && !this.isHidden(element.id)) {
        visibleFacts.count++;
        element.setAttribute(`active-fact`, ``);
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

  setActiveFilteredFact(): void {
    const allFacts = Array.from(document.querySelectorAll(`[contextRef]`));
    const visibleFacts = { count: 0 };
    allFacts.forEach((element: Element) => {
      if (
        this.factIsActive(element.id) &&
        this.isInViewPort(element) &&
        !this.isHidden(element.id)
      ) {
        visibleFacts.count++;
        element.setAttribute(`active-fact`, ``);
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

  factIsHighlighted = (id: string): boolean => {
    const storeData: StoreData = StoreData.getInstance();
    return storeData.getFactByID(id).highlight ? true : false;
  };
  factIsActive = (id: string): boolean => {
    const storeData: StoreData = StoreData.getInstance();
    return storeData.getFactByID(id).active ? true : false;
  };

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

  isHidden = (id: string): boolean => {
    const storeData: StoreData = StoreData.getInstance();
    return storeData.getFactByID(id)[`ixv:hidden`] ? true : false;
  };
}
