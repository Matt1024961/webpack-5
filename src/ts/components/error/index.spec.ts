import {} from 'jasmine';
import { Error } from '.';
describe('Error Component', () => {
  let component: Error;
  const body = document.querySelector(`body`);
  beforeEach(() => {
    // we instantiate the component
    component = new Error();
    body.appendChild(component);
  });

  it('Created Component', () => {
    return expect(component).toBeTruthy();
  });

  it('renders', () => {
    const element = document.querySelector(`sec-error`);
    expect(element).toEqual(component);
  });
});
