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
import DispatchStateStore from '../../src/store/DispatchStateStore';

describe('DispatchStateStore', () => {
  it('get/set state', () => {
    const store = new DispatchStateStore(), state = { foo: 'bar' };
    store._setState(state);
    expect(store.getState()).to.equal(state);
  });

  it('get/set tokens', () => {
    const store = new DispatchStateStore(), tokens = { 'EVENT_NAME': 'ID_1' };
    store._setTokens(tokens);
    expect(store.getToken('EVENT_NAME')).to.equal('ID_1');
  });

  it('throws error for invalid tokens', () => {
    const store = new DispatchStateStore();
    expect(() => store.getToken('INVALID_EVENT_NAME'))
      .to.throw('A handler for event name "INVALID_EVENT_NAME" must be registered in this store!');
  });
});
