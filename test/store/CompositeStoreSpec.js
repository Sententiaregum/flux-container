/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CompositeStore from '../../src/store/CompositeStore';
import DispatchStateStore from '../../src/store/DispatchStateStore';
import { expect } from 'chai';

describe('store::CompositeStore', () => {
  it('saves a store and its corresponding state', () => {
    const composite = new CompositeStore(), store = new DispatchStateStore(), state1 = {}, state2 = [];
    composite.saveStore(store, state1);

    expect(composite.getState(store)).to.equal(state1);
    composite.saveStore(store, state2);
    expect(composite.getState(store)).to.equal(state2);
  });

  it('tries to get state from inexistent store', () => {
    const composite = new CompositeStore();
    expect(() => composite.getState(new DispatchStateStore())).to.throw('The index cannot be found since the store is not registered!');
  });

  it('tries to get invalid store', () => {
    const composite = new CompositeStore();
    expect(() => composite.saveStore({}, {})).to.throw('The store must be an instance of \'DispatchStateStore\'!');
  });
});
