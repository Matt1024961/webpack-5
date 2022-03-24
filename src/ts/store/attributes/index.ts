import { StoreData } from '../data';
import { StoreFilter } from '../filter';
import { StoreUrl } from '../url';

export class Attributes {
  constructor() {
    //
  }

  setActiveFact() {
    const storeFilter: StoreFilter = StoreFilter.getInstance();
    const storeUrl: StoreUrl = StoreUrl.getInstance();
    const storeData: StoreData = StoreData.getInstance();
    const currentFacts = storeData.getFilingFactsIDs(storeUrl.filing);
    const allFacts = document.querySelectorAll(`[contextRef]`);
    console.log(`set active fact(s)`);
    let visibleFacts = 0;
    if (storeFilter.search) {
      allFacts.forEach((element: Element) => {
        if (
          currentFacts.includes(element.id) &&
          this.isInViewPort(element) &&
          !this.isHidden(element)
        ) {
          visibleFacts++;
          element.setAttribute(`active-filtered-fact`, ``);
          // these are the facts that we interact with (only)
        } else {
          element.removeAttribute(`active-fact`);
        }
      });
      console.log(`User can see/interact with: ${visibleFacts}`);
    } else {
      allFacts.forEach((element: Element) => {
        if (
          this.isInViewPort(element) &&
          !this.isHidden(element) &&
          !element.getAttribute(`active-fact`)
        ) {
          element.setAttribute(`active-fact`, ``);
          element.addEventListener(`click`, (event) => {
            console.log(event);
            console.log(this);
          });
        }
      });
    }
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

  isHidden = (element: Element): boolean => {
    if (element) {
      const style = window.getComputedStyle(element);
      if (style.display == 'none') {
        return true;
      }
      if (getComputedStyle(element).display === 'none') {
        return true;
      }
      if (element.parentElement) {
        // console.log(element.parentElement);
        return this.isHidden(element.parentElement);
      }
    }
    return false;
  };
}
