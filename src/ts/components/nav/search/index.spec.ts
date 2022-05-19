describe('Navbar Search Component', () => {
  const COMPONENT_TAG = `sec-search`;
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
  });
});
