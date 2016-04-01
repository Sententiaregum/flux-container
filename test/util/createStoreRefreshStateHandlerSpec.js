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
import BaseStore from '../../src/BaseStore';
import { expect } from 'chai';
import sinon from 'sinon';

describe('util::createStoreRefreshStateHandler', () => {
  it('throws errors if an invalid store is given', () => {
    expect(() => createStoreRefreshStateHandler({}, {})).to.throw('The store must be an instance of "flux-container/BaseStore"!');
  });

  describe('callback factory', () => {
    it('creates callback which flushes payload through store and to the view', () => {
      const store = new BaseStore();
      store.emitChange = sinon.spy();
      const handler = createStoreRefreshStateHandler(store, {
        function: (param) => {
          return {
            data: param
          }
        }
      });

      handler('Param');
      expect(store.emitChange.calledOnce).to.equal(true);
      expect(store.state.data).to.equal('Param');
    });

    it('creates a custom callback', () => {
      const store = new BaseStore();
      store.emitChange = sinon.spy();
      const handler = createStoreRefreshStateHandler(store, { params: ['name'] });

      const data = 'foo';
      handler(data);
      expect(store.state.name).to.equal(data);
    });
  });
});
