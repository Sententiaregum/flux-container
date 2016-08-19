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
import sinon from 'sinon';
import runAction from '../src/runAction';
import AppDispatcher from '../src/dispatcher/AppDispatcher';

describe('runAction', () => {
  it('builds an action from invalid data', () => {
    expect(() => runAction('foo', [])).to.throw('The `actionCreator` must be a function that builds the actions.');
  });

  it('executes an action', () => {
    const payload = { foo: [] },
      factory     = publish => {
        return {
          EVENT_NAME: item => publish({ foo: item })
        }
      };

    sinon.stub(AppDispatcher, 'dispatch');
    runAction('EVENT_NAME', factory, [[]]);

    expect(AppDispatcher.dispatch.calledOnce).to.equal(true);
    expect(AppDispatcher.dispatch.calledWith('EVENT_NAME', payload)).to.equal(true);

    AppDispatcher.dispatch.restore();
  });

  it('dispatches multiple actions', () => {
    const payload = { foo: [] },
      factory     = publish => {
        return {
          EVENT_NAME: item => runAction('OTHER', factory, [item]),
          OTHER:      item => publish({ foo: item })
        }
      };

    sinon.stub(AppDispatcher, 'dispatch');
    runAction('EVENT_NAME', factory, [[]]);

    expect(AppDispatcher.dispatch.calledOnce).to.equal(true);
    expect(AppDispatcher.dispatch.calledWith('OTHER', payload)).to.equal(true);
    expect(AppDispatcher.dispatch.calledWith('EVENT_NAME', payload)).to.equal(false);

    AppDispatcher.dispatch.restore();
  });
});
