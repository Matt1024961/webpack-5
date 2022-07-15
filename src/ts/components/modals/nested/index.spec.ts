describe('Modal Fact Component', () => {
    const COMPONENT_TAG = `sec-modal-fact`;
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
  