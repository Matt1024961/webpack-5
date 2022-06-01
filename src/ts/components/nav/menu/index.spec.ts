describe('Navbar Menu Component', () => {
  const COMPONENT_TAG = `sec-menu`;
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
      expect(element.querySelector(`#menu-button`)).toBeTruthy();
    });

    it('should render dropdown items', () => {
      expect(element.querySelectorAll(`#menu-dropdown li`).length).toBe(7);
    });
  });
});
