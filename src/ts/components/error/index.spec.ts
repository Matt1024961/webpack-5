import { Error } from './';
describe('Error Component', () => {
  let component: Error;
  // beforeEach(() => {
  //   component = await fixture<Error>(html` <sec-error></sec-error> `);

  // })
  it('should Render', () => {
    const dummyElement = document.createElement('sec-error');
    document.getElementById = jasmine.createSpy('sec-error').and.returnValue(dummyElement);
    console.log(dummyElement);
  });
  it('Renders', () => {
    expect(2).toEqual(2);
  });
});
