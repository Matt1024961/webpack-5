describe('Navbar Data Component', () => {
  const COMPONENT_TAG = `sec-data`;
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
      expect(element.querySelector(`#data-button`)).toBeTruthy();
    });

    it('should render dropdown items', () => {
      expect(element.querySelectorAll(`form li`).length).toBe(6);
    });
  });
});
