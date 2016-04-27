/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { expect } from 'chai';
import connector from '../src/connector';
import store from '../src/store';

describe('connector', () => {
  it('throws an error if an invalid store is passed', () => {
    class FooStore {
    }

    expect(() => {
      connector(new FooStore());
    }).to.throw('In order to work properly, the store must be an instance of DispatchStateStore!');
  });

  it('creates a connection object', () => {
    const Store = store({}, {}), handler = connector(Store);
    expect(handler.store).to.equal(Store);
    expect(typeof handler.useWith).to.not.equal('undefined');
    expect(typeof handler.unsubscribe).to.not.equal('undefined');
    expect(typeof handler.register).to.not.equal('undefined');
  });
});
