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
import BaseStore from '../src/BaseStore';
import sinon from 'sinon';

describe('connector', () => {
  class TestStore extends BaseStore {
  }

  describe('error handling', () => {
    it('throws an error if an invalid store is passed', () => {
      class FooStore {
      }

      expect(() => {
        connector(new FooStore());
      }).to.throw('In order to work properly, the store must be an instance of BaseStore!');
    });

    it('contains invalid handler on handler registration', () => {
      expect(() => {
        connector(new TestStore()).useWith('invalid handler');
      }).to.throw('The store handler must be a function!');
    });

    it('contains invalid handler on unsubscription', () => {
      expect(() => {
        connector(new TestStore()).unsubscribe('invalid handler');
      }).to.throw('The store handler must be a function!');
    });
  });

  describe('view listener registration', () => {
    it('registers listeners on the store\'s change event', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), store = new TestStore();
      connector(store).useWith(spy1);
      connector(store).useWith(spy2);

      store.emitChange();
      connector(store).unsubscribe(spy1);
      store.emitChange();

      expect(spy1.calledOnce).to.equal(true);
      expect(spy2.calledTwice).to.equal(true);
    });
  });
});
