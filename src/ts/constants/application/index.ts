export const ConstantApplication = {

  version: `3.0.0`,

  factMenuPagination: {
    start: 0,
    end: 9,
    amount: 10,
    page: 0,
    totalPages: 0,
  },

  enableApplication: () => {
    document
      .querySelectorAll(`#navbar-container .nav-link`)
      .forEach((current) => {
        current.classList.remove(`disabled`);
        current.removeAttribute(`disabled`);
      });
    document.querySelectorAll(`#global-search fieldset`).forEach((current) => {
      current.removeAttribute(`disabled`);
    });
  },

  disableApplication: () => {
    document
      .querySelectorAll(`#navbar-container .nav-link`)
      .forEach((current) => {
        current.classList.add(`disabled`);
      });
    document.querySelectorAll(`#global-search fieldset`).forEach((current) => {
      current.setAttribute(`disabled`, ``);
    });
  },

  removeClassFromAeeay: (array: Array<Element>, className: string) => {
    array.forEach((current) => { current.classList.remove(className) });
  },

  removeAllAttributesFromArray: (array: Array<Element>, attribute: string) => {
    array.forEach((current) => { current.removeAttribute(attribute) });
  },

  removeChildNodes: (parent: Element) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },

  setElementFocus: (element: HTMLElement | null) => {
    if (element) {
      setTimeout(() => {
        element.focus();
      });
    }
  },

  flattenObject: (obj: { [x: string]: any }, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object') {
        if (Array.isArray(obj[k])) {
          acc[pre + k] = obj[k];
        } else {
          Object.assign(
            acc,
            ConstantApplication.flattenObject(obj[k], pre + k)
          );
        }
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  },
};
