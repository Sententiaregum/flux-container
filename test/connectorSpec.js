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
import sinon from 'sinon';
import EventEmitter from 'events';

describe('connector', () => {
  it('glues a store and its emitter together with a view handler', function () {
    this.expected = 10;

    const testStore = {};
    const emitter   = new EventEmitter();
    const spy       = sinon.spy();
    const api       = connector(testStore);

    api.register(emitter);
    api.subscribe(spy);
    emitter.emit('change');
    api.unsubscribe(spy);
    emitter.emit('change');

    expect(spy.calledOnce).to.equal(true);
    expect(spy.calledWith()).to.equal(true);
  });

  it('avoids duplicated store subscriptions', function () {
    this.expected  = 3;

    const testStore = {};
    const emitter   = new EventEmitter();
    const spy       = sinon.spy();
    const api       = connector(testStore);

    // registering the same emitter two times would mean that all callbacks would be attached multiple times
    // and evaluated multiple times in case of changes.
    api.register(emitter);
    api.register(emitter);
    api.subscribe(spy);

    emitter.emit('change');

    expect(spy.calledOnce).to.equal(true);
  });

  describe('error handling', () => {
    it('registers an invalid handler', function () {
      this.expected = 3;

      const testStore = {};
      const api       = connector(testStore);

      api.register(new EventEmitter);
      expect(() => api.subscribe('invalid value')).to.throw('The store handler must be a function!');
    });

    it('attempts to subscribe an unknown store', function () {
      this.expected = 2;
      expect(() => connector({}).subscribe(() => {})).to.throw('The store is not registered! Please use the `store()` function to assemble a store properly and register it automatically!');
    });

    it('tries to use an invalid emitter API', function () {
      this.expected = 2;
      expect(() => connector({}).register({})).to.throw('Emitter must be node\'s core emitter!');
    });
  });
});
