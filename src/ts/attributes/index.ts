import { getAllFacts } from "../redux/reducers/facts";

export class Attributes {
  constructor(doBothActions: boolean) {
    if (doBothActions) {
      this.setProperAttribute();
      this.listeners();
    } else {
      this.setProperAttribute();
    }
  }

  listeners = () => {
    document.addEventListener(`scroll`, () => {
      this.setProperAttribute();
    });
    const allFacts = Array.from(document.querySelectorAll(`[fact]`));
    allFacts.forEach((fact) => {
      const element = document.getElementById(fact.id as string);
      if (element) {
        element.addEventListener(`click`, (event) => {
          event.stopPropagation();
          event.preventDefault();
          this.removeAttributes(`selected-fact`);
          element.setAttribute(`selected-fact`, ``);
          const modal = document.createElement(
            `sec-modal-fact${
              element.hasAttribute(`nested-fact-parent`) ? `-nested` : ``
            }`
          );
          modal.setAttribute(`fact-id`, element.getAttribute(`id`) as string);
          document.querySelector(`#modal-container`)?.append(modal);
        });
      }
    });
  };

  setProperAttribute = () => {
    const allFacts = getAllFacts();
    allFacts.forEach((fact) => {
      const element = document.getElementById(fact.id as string);
      if (element) {
        const isfactHidden = fact.isHidden;
        const isFactActive = fact.isActive;
        const isFactHighlight = fact.isHighlight;
        const isFactBlock = fact.isHtml || fact.isText;
        const inViewport = this.isInViewPort(
          element as HTMLElement,
          isfactHidden as boolean
        );
        if (inViewport) {
          element.setAttribute(`fact`, ``);
          this.findNestedFacts(element);
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
      }
    });
  };

  isInViewPort = (element: Element, isHidden: boolean) => {
    if (isHidden) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  findNestedFacts = (element: Element) => {
    const possibleNestedFacts = Array.from(
      element.querySelectorAll(`[contextref] *`)
    );
    possibleNestedFacts.forEach((current) => {
      if (!element.hasAttribute(`nested-fact-parent`)) {
        element.setAttribute(
          `nested-fact-parent`,
          `${current.querySelectorAll(`[contextref] *`).length}`
        );
      }

      if (!current.hasAttribute(`nested-fact-child`)) {
        current.setAttribute(`nested-fact-child`, ``);
        //console.log(`nested`);
      }
    });
  };

  removeAttributes = (input: string) => {
    Array.from(
      document.querySelectorAll(`#filing-container [${input}]`)
    ).forEach((current) => {
      current.removeAttribute(input);
    });
  };
}
