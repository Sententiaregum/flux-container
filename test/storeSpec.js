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

describe('store', () => {
  it('assembles a store', function () {
    this.expected  = 5;
    const initial  = {};
    const fooStore = store({
      'EVENT_NAME': {
        function: () => {},
      }
    }, initial);

    expect(fooStore.getState()).to.equal(initial);
    expect(typeof fooStore.getToken('EVENT_NAME')).to.not.equal('undefined');
  });

  describe('state handling', () => {
    it('uses generic initializer which will be used lazily', function () {
      this.expected = 15;

      const initializer = sinon.spy();
      const newStore    = store({}, initializer);

      newStore.getState();

      // asserting that it's called once only.
      // The next time it's already initialized and the state contains the actual value.
      newStore.getState();

      expect(initializer.calledOnce).to.equal(true);
    });

    describe('property path evaluation of state objects', () => {
      it('fetches state by evaluating a property path', function () {
        this.expected = 3;

        const newStore = store({}, {
          foo: [
            { bar: 'any-value' }
          ]
        });

        expect(newStore.getStateValue('foo.0.bar')).to.equal('any-value');
      });

      it('fetches state from an array in a property path semantically correct as described in #33', function () {
        this.expected = 3;

        const newStore = store({}, {
          foo: [
            { bar: { blah: 'any-value' } }
          ]
        });

        expect(newStore.getStateValue('foo[0].bar.blah')).to.equal('any-value');
      });

      it ('fetches state from an array where the array is the first level of the state', function () {
        this.expected = 2;

        const newStore = store({}, [
          [
            { bar: { blah: 'any-value' } }
          ]
        ]);

        expect(newStore.getStateValue('[0][0].bar.blah')).to.equal('any-value');
      });

      it('handles simple array expression', function () {
        this.expected = 2;

        const newStore = store({}, [0]);

        expect(newStore.getStateValue('[0]')).to.equal(0);
      });

      it('handles array expression at start and end', function () {
        this.expected = 2;
        const newStore = store({}, [{
          bar: ['foo']
        }]);

        expect(newStore.getStateValue('[0].bar[0]')).to.equal('foo');
      });
    });

    it('returns default value in case of invalid property path', function () {
      this.expected = 2;

      const newStore = store({}, {});

      expect(newStore.getStateValue('foo.property', 'default')).to.equal('default');
    });

    it('throws error if proeprty path evaluation should be computed on a scalar', function () {
      this.expected = 2;
      expect(() => store({}, 'BLAH').getStateValue('foo.property')).to.throw('To evaluate a property path, the value must be an object or an array!');
    });
  });
});
