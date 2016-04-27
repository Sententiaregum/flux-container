/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

import store from '../../src/store';
import DispatchStateStore from '../../src/store/DispatchStateStore';
import sinon from 'sinon';
import { expect } from 'chai';
import StoreList from '../../src/store/StoreList';
import EventEmitter from 'events';
import StoreViewConnector from '../../src/store/StoreViewConnector';

describe('store::StoreViewConnector', () => {
  const TestStore = store({}, {});
  describe('error handling', () => {
    it('contains invalid handler on handler registration', () => {
      expect(() => {
        new StoreViewConnector(TestStore, new StoreList()).register(new EventEmitter()).useWith('invalid handler');
      }).to.throw('The store handler must be a function!');
    });

    it('contains invalid handler on unsubscription', () => {
      expect(() => {
        new StoreViewConnector(TestStore, new StoreList()).register(new EventEmitter()).unsubscribe('invalid handler');
      }).to.throw('The store handler must be a function!');
    });

    it('aborts for not registered stores', () => {
      class Store extends DispatchStateStore {}

      expect(() => {
        new StoreViewConnector(new Store(), new StoreList).useWith(() => {});
      }).to.throw('The store is not registered! Please use the `store()` function to assemble a store properly and register it automatically!');
    });
  });

  describe('view listener registration', () => {
    it('registers listeners on the store\'s change event', () => {
      class Store extends DispatchStateStore {
      }

      const spy1 = sinon.spy(),
          spy2 = sinon.spy(),
          store = new Store(),
          emitter = new EventEmitter(),
          handler = new StoreViewConnector(store, new StoreList()).register(emitter);

      handler.register(emitter);
      handler.useWith(spy1);
      handler.useWith(spy2);

      emitter.emit('change');
      handler.unsubscribe(spy1);
      emitter.emit('change');

      expect(spy1.calledOnce).to.equal(true);
      expect(spy2.calledTwice).to.equal(true);
    });
  });
});
