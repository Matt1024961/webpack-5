import { ConstantApplication } from '../../../constants/application';
import { enterFactsToStore } from '../../../redux/test-helpers/facts';
describe('Facts Single Component', () => {
  const COMPONENT_TAG = `sec-facts-menu-single`;
  let element: HTMLElement;
  beforeAll(() => {
    enterFactsToStore();
    element = document.createElement(COMPONENT_TAG);
    element.setAttribute(
      `pagination`,
      JSON.stringify(ConstantApplication.factMenuPagination)
    );
    document.body.append(element);
  });

  afterAll(() => {
    document.querySelector(COMPONENT_TAG)?.remove();
  });

  describe('attributeChangedCallback()', () => {
    it('should render', () => {
      expect(element).toBeTruthy();
    });
  });
});

