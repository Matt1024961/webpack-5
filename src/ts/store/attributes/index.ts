import { StoreData } from '../data';
import { StoreFilter } from '../filter';
import { StoreLogger } from '../logger';

export class Attributes {
  constructor() {
    //
  }

  setProperAttribute() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    const allFacts = document.querySelectorAll(`[contextRef]`);
    const visibleFacts = { count: 0 };
    if (!storeFilter.search) {
      allFacts.forEach((element: Element) => {
        if (
          this.isInViewPort(element) &&
          !this.isHidden(element.id) &&
          !element.getAttribute(`active-fact`)
        ) {
          visibleFacts.count++;
          element.setAttribute(`active-fact`, ``);
          element.addEventListener(`click`, (event) => {
            console.log(event);
            console.log(this);
          });
        }
      });
    }
    // dear Matt, remove these two lines below
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    storeLogger.log(`Visible Active Facts in ViewPort: ${visibleFacts.count}`);
  }

  setActiveFilteredFact() {
    //
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

  isHidden = (id: string): boolean => {
    const storeData: StoreData = StoreData.getInstance();
    return storeData.getFactByID(id)[`ixv:hidden`] ? true : false;
  };
}
