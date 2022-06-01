describe('Navbar Reset All Filters Component', () => {
  const COMPONENT_TAG = `sec-reset-all-filters`;
  let element: HTMLElement;
  beforeAll(() => {
    element = document.createElement(COMPONENT_TAG);
    document.body.append(element);
  });

  afterAll(() => {
    document.querySelector(COMPONENT_TAG)?.remove();
  });

  describe('connectedCallback()', () => {
    it('should render', () => {
      expect(element).toBeTruthy();
    });

    it('should render navbar button', () => {
      expect(element.querySelector(`#reset-all-filters-button`)).toBeTruthy();
    });
  });
});
