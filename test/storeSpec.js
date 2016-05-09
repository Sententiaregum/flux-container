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
  it('assembles a store', () => {
    const initial = {};
    const fooStore = store({
      'EVENT_NAME': {
        function: (foo, bar) => {},
        params:   ['foo', 'bar']
      }
    }, initial);

    expect(fooStore.getState()).to.equal(initial);
    expect(typeof fooStore.getToken('EVENT_NAME')).to.not.equal('undefined');
  });

  it('uses generic initializer', () => {
    const initializer = sinon.spy();
    store({}, initializer);

    expect(initializer.calledOnce).to.equal(true);
  });

  describe('immutability', () => {
    const initial = {};
    const fooStore = store({}, initial);

    it('makes immutable event config', () => {
      expect(() => fooStore.tokens.foo = {}).to.throw('Can\'t add property foo, object is not extensible');
    });

    it('makes list immutable', () => {
      expect(() => fooStore.tokens = {}).to.throw('Cannot assign to read only property \'tokens\' of [object Object]');
    });
  });
});
