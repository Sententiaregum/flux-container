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

describe('util::createStoreRefreshStateHandler', function () {
  describe('callback factory', function () {
    it('creates a custom callback', function () {
      this.expected = 15;
      const save    = sinon.stub().returns(true);
      const emitter = new EventEmitter;
      emitter.emit  = sinon.spy();
      const handler = createStoreRefreshStateHandler(save, emitter, {
        function: ({ param }) => {
          return {
            data: param
          }
        }
      }, {});

      handler({ param: 'Param' });
      expect(emitter.emit.calledOnce).to.equal(true);
      expect(emitter.emit.calledWith('change')).to.equal(true);
      expect(save.calledOnce).to.equal(true);
      expect(save.calledWith({ data: 'Param' })).to.equal(true);
    });

    it('creates callback which flushes payload through store and to the view', function () {
      this.expected = 3;
      const save    = sinon.spy();
      const handler = createStoreRefreshStateHandler(save, new EventEmitter, {}, {});

      const data = { name: 'foo' };
      handler(data);
      expect(save.calledOnce).to.equal(true);
      expect(save.calledWith({ name: 'foo' })).to.equal(true);
    });

    it('merges new and old state', function () {
      this.expected = 3;
      const save    = sinon.stub().returns(true);
      const handler = createStoreRefreshStateHandler(save, new EventEmitter, {
        function: [({ param }, current) => {
          return {
            data: [
              param,
              current.param
            ]
          }
        }]
      }, { param: 'Old' });

      handler({ param: 'Param' });
      expect(save.calledOnce).to.equal(true);
      expect(save.calledWith({ data: ['Param', 'Old'] })).to.equal(true);
    });

    it('modifies a subsection', function () {
      this.expected = 3;
      const save    = sinon.stub().returns(true);
      const handler = createStoreRefreshStateHandler(save, new EventEmitter, { function: ['section'] }, { section: {
        foo: 'bar'
      } });

      handler({ foo: '12345' });
      expect(save.calledOnce).to.equal(true);
      expect(save.calledWith({ section: { foo: '12345' } })).to.equal(true);
    });
  });

  it('avoids update if save handler fails', function () {
    this.expected = 3;
    const save    = () => false;
    const emitter = new EventEmitter;

    emitter.emit  = sinon.spy();
    const handler = createStoreRefreshStateHandler(save, emitter, { params: ['name'] }, {});

    const data = 'foo';
    handler(data);

    expect(emitter.emit.calledOnce).to.equal(false);
  });

  it('throws an error if and invalid type is given', function () {
    this.expected = 3;
    expect(function () {
      const handler = createStoreRefreshStateHandler(function () {}, new EventEmitter, { function: [] }, {});
      handler();
    }).to.throw('The `function` value must be a non-empty array!');
  });
});
