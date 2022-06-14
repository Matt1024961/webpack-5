import { enterFactsToStore } from "../../../redux/test-helpers/facts";
describe('Facts Pagination Component', () => {
  const COMPONENT_TAG = `sec-facts-menu-pagination`;
  let element: HTMLElement;
  beforeAll(() => {
    enterFactsToStore();
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

    it('should render link items', () => {
      expect(element.querySelectorAll(`.page-item`).length).toBe(6);
    });

  });
});
