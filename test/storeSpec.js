/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import store from '../src/store';
import { expect } from 'chai';
import sinon from 'sinon';
import TestUtils from '../src/testing/TestUtils';

describe('store', () => {
  it('assembles a store', () => {
    const initial  = {};
    const fooStore = store({
      'EVENT_NAME': {
        function: (foo, bar) => {},
        params:   ['foo', 'bar']
      }
    }, initial);

    expect(fooStore.getState()).to.equal(initial);
    expect(typeof fooStore.getToken('EVENT_NAME')).to.not.equal('undefined');
  });

  describe('state handling', () => {
    it('uses generic initializer which will be used lazily', () => {
      const initializer = sinon.spy();
      const newStore    = store({}, initializer);

      newStore.getState();

      // asserting that it's called once only.
      // The next time it's already initialized and the state contains the actual value.
      newStore.getState();

      expect(initializer.calledOnce).to.equal(true);
    });

    it('fetches state by evaluating a property path', () => {
      const newStore = store({}, {
        foo: [
          { bar: 'any-value' }
        ]
      });

      expect(newStore.getStateValue('foo.0.bar')).to.equal('any-value');
    });

    it('returns default value in case of invalid property path', () => {
      const newStore = store({}, {});

      expect(newStore.getStateValue('foo.property', 'default')).to.equal('default');
    });

    it('throws error if proeprty path evaluation should be computed on a scalar', () => {
      expect(() => store({}, 'BLAH').getStateValue('foo.property')).to.throw('To evaluate a property path, the value must be an object or an array!');
    });
  });
});
