/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AppDispatcher from '../src/AppDispatcher';
import BaseStore from '../src/BaseStore';
import { expect } from 'chai';

describe('BaseStore', () => {
  it('connects the listeners to the dispatcher', () => {
    class Store extends BaseStore {
      getSubscribedEvents() {
        return [
          {
            name: 'CHANGE',
            function: () => {},
            params: []
          }
        ];
      }
    }

    const instance = new Store();
    instance.init();

    expect(typeof AppDispatcher.store[instance.getDispatchTokenByEventName('CHANGE')]).to.not.equal('undefined');
  })
});
 