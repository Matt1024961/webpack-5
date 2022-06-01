describe('Navbar Links Component', () => {
  const COMPONENT_TAG = `sec-links`;
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
      expect(element.querySelector(`#links-button`)).toBeTruthy();
    });
  });
});
