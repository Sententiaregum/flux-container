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
import Dispatcher from '../../src/dispatcher/Dispatcher';
import sinon from 'sinon';

describe('dispatcher::Dispatcher', () => {
  var dispatcher;

  beforeEach(() => {
    dispatcher = Dispatcher;
  });

  afterEach(() => {
    dispatcher.reset();
  });

  describe('callback handling', () => {
    it('adds a dispatcher callback for a certain event and generates an ID', () => {
      const func = () => {};
      const ID   = dispatcher.addListener('CHANGE', func, ['ID_XY']);

      expect(ID).to.equal('ID_1');
      expect(typeof dispatcher.store.ID_1).to.not.equal('undefined');
      expect(dispatcher.counter).to.equal(2);
      expect(dispatcher.store['ID_1'].eventName).to.equal('CHANGE');
      expect(dispatcher.store['ID_1'].callback).to.equal(func);
      expect(dispatcher.store['ID_1'].dependencies[0]).to.equal('ID_XY');
    });

    it('generates IDs for every callback', () => {
      expect(dispatcher._generateDispatchID()).to.equal('ID_1');
      expect(dispatcher._generateDispatchID()).to.equal('ID_2');
      expect(dispatcher._generateDispatchID()).to.equal('ID_3');
    });

    it('creates an array automatically if no dependencies are provided', () => {
      dispatcher.addListener('CHANGE', () => {});
      expect(dispatcher.store['ID_1'].dependencies.length).to.equal(0);
    });

    it('removes a callback successfully', () => {
      const ID = dispatcher.addListener('CHANGE', () => {}, []);
      expect(Object.keys(dispatcher.store).length).to.equal(1);

      dispatcher.removeListener(ID);
      expect(Object.keys(dispatcher.store).length).to.equal(0);
    });

    it('throws errors if an invalid callback should be removed', () => {
      expect(() => dispatcher.removeListener('ID_0')).to.throw('The ID "ID_0" must be present in the event store!');
    })
  });

  describe('dispatch handling', () => {
    it('executes listeners by their event name', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy();
      dispatcher.addListener('event_1', spy1, []);
      dispatcher.addListener('event_2', spy2, []);

      dispatcher.dispatch('event_1', {});
      expect(spy1.calledOnce).to.equal(true);
      expect(spy2.called).to.equal(false);
    });

    it('executes listeners with a given payload', () => {
      const payload = {
        foo: 'bar'
      };

      const callback = (payload) => {
        expect(payload.foo).to.equal('bar');
      };

      dispatcher.addListener('event', callback, []);
      dispatcher.dispatch('event', payload);
    });

    it('executes callbacks in the proper order', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy();
      const t1   = dispatcher.addListener('event', spy1, []);
      dispatcher.addListener('event', spy2, []);
      dispatcher.addListener('event', spy3, [t1]);

      dispatcher.dispatch('event', {});
      expect(spy1.calledBefore(spy3)).to.equal(true);
      expect(spy2.calledBefore(spy1)).to.equal(true);
    });
  });
});
