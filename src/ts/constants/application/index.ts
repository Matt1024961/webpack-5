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
      });
    document.querySelectorAll(`#global-search fieldset`).forEach((current) => {
      current.removeAttribute(`disabled`);
    });
  },

  removeChildNodes: (parent: Element) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
};
