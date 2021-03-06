describe('Root Component', () => {
  const COMPONENT_TAG = `sec-root`;
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

    it('should render proper sections', () => {
      expect(element.querySelectorAll(`section`).length).toBe(9);
    });
  });
});
