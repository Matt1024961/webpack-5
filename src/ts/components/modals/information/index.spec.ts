describe('Modal Information Component', () => {
  const COMPONENT_TAG = `sec-modal-information`;
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

    it('should render modal', () => {
      expect(document.getElementById(`sec-modal`)).toBeTruthy();
    });

    it('should render correct title', () => {
      expect(element.querySelector(`.modal-title`)?.textContent?.trim()).toBe(
        `Company and Document`
      );
    });

    it('should render correct modal actions', () => {
      expect(element.querySelectorAll(`.modal-actions button`).length).toBe(3);
    });
  });
});
