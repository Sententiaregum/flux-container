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
import EventEmitter from 'events';

describe('util::createStoreRefreshStateHandler', () => {
  describe('callback factory', () => {
    it('creates a custom callback', () => {
      const save    = sinon.spy();
      const emitter = new EventEmitter;
      emitter.emit  = sinon.spy();
      const handler = createStoreRefreshStateHandler(save, emitter, {
        function: (param) => {
          return {
            data: param
          }
        }
      });

      handler('Param');
      expect(emitter.emit.calledOnce).to.equal(true);
      expect(emitter.emit.calledWith('change')).to.equal(true);
      expect(save.calledOnce).to.equal(true);
      expect(save.calledWith({ data: 'Param' })).to.equal(true);
    });

    it('creates callback which flushes payload through store and to the view', () => {
      const save    = sinon.spy();
      const handler = createStoreRefreshStateHandler(save, new EventEmitter, { params: ['name'] });

      const data = 'foo';
      handler(data);
      expect(save.calledOnce).to.equal(true);
      expect(save.calledWith({ name: 'foo' })).to.equal(true);
    });
  });
});
