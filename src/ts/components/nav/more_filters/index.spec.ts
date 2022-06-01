describe('Navbar More Filters Component', () => {
  const COMPONENT_TAG = `sec-more-filters`;
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
      expect(element.querySelector(`#more-filters-button`)).toBeTruthy();
    });

    it('should render accordion items', () => {
      expect(element.querySelectorAll(`.accordion-item`).length).toBe(5);
    });
  });
});
