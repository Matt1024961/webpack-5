import { expect } from 'chai';
import { LoggerManager } from 'typescript-logger';

import Navbar from './../../src/ts/navbar';

describe('Hello', () => {
  it('Renders header', () => {
    const logger = LoggerManager.create('Inline XBRL Viewer');
    const navbar = new Navbar(`#navbar`, logger);
    //console.log(navbar);
    expect({ a: 1 }).to.not.have.property('b');
  });
});
