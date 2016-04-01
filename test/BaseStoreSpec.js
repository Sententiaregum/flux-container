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
import sinon from 'sinon';

describe('BaseStore', () => {
  beforeEach(() => {
    AppDispatcher.store = {};
    AppDispatcher.counter = 1;
  });

  describe('store <> dispatcher connection', () => {
    class Store extends BaseStore {
      getSubscribedEvents() {
        return [
          {
            name: 'CHANGE',
            params: ['foo']
          }
        ];
      }
    }

    it('connects the listeners to the dispatcher', () => {
      const instance = new Store();
      instance.init();

      expect(typeof AppDispatcher.store[instance.getDispatchTokenByEventName('CHANGE')]).to.not.equal('undefined');
    });

    it('executes the listener which automates the store data handling workflow', () => {
      const instance = new Store();
      instance.init();
      instance.emitChange = sinon.spy();
      AppDispatcher.dispatch('CHANGE', {
        foo: 'bar'
      });

      expect(instance.emitChange.calledOnce).to.equal(true);
      expect(instance.state.foo).to.equal('bar');
    });
  });

  it('throws errors in case of invalid tokens', () => {
    const store = new BaseStore();
    expect(() => store.getDispatchTokenByEventName('CHANGE')).to.throw('No callback is registered for event "CHANGE" in that store!');
  });

  it('throws errors if `getSubscribedEvens` is not overriden', () => {
    const store = new BaseStore();
    expect(() => store.getSubscribedEvents()).to.throw('This method is abstract and must be overriden by the parent!');
  });

  it('emits changes', () => {
    const store = new BaseStore();
    store.emit = sinon.spy();
    store.emitChange();
    expect(store.emit.calledWith(store.CHANGE_EVENT)).to.equal(true);
  });
});
