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

import createStoreRefreshStateHandler from '../../src/util/createStoreRefreshStateHandler';
import { expect } from 'chai';
import sinon from 'sinon';
import DispatchStateStore from '../../src/store/DispatchStateStore';
import EventEmitter from 'events';

describe('util::createStoreRefreshStateHandler', () => {
  it('throws errors if an invalid store is given', () => {
    expect(() => createStoreRefreshStateHandler({}, {})).to.throw('The store must be an instance of "flux-container/store/DispatchStateStore"!');
  });

  describe('callback factory', () => {
    it('creates callback which flushes payload through store and to the view', () => {
      const store = new DispatchStateStore();
      const emitter = new EventEmitter;
      emitter.emit = sinon.spy();
      const handler = createStoreRefreshStateHandler(store, emitter, {
        function: (param) => {
          return {
            data: param
          }
        }
      });

      handler('Param');
      expect(emitter.emit.calledOnce).to.equal(true);
      expect(emitter.emit.calledWith('change')).to.equal(true);
      expect(store.getState().data).to.equal('Param');
    });

    it('creates a custom callback', () => {
      const store = new DispatchStateStore();
      store.emitChange = sinon.spy();
      const handler = createStoreRefreshStateHandler(store, new EventEmitter, { params: ['name'] });

      const data = 'foo';
      handler(data);
      expect(store.getState().name).to.equal(data);
    });
  });
});
