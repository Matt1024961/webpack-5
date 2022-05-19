describe('Error Component', () => {
  const COMPONENT_TAG = `sec-error`;
  let element: HTMLElement;
  beforeAll(() => {
    element = document.createElement(COMPONENT_TAG);
    element.setAttribute(`message`, `Unit Testing`);
    document.body.append(element);
  });

  afterAll(() => {
    document.querySelector(COMPONENT_TAG)?.remove();
  });

  describe('connectedCallback()', () => {
    it('should render', () => {
      expect(element).toBeTruthy();
    });

    it(`should have proper HTML Attribute`, () => {
      expect(element.getAttribute(`message`)).toBe(`Unit Testing`);
    });

    it(`should have proper CSS classes`, () => {
      expect(element.children[0].classList.toString()).toBe(
        `alert alert-danger`
      );
    });

    it(`should have proper message to user`, () => {
      expect(element.textContent?.trim()).toBe(`Unit Testing`);
    });
  });
});
