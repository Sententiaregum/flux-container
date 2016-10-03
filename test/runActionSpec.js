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
import Dispatcher from '../src/dispatcher/Dispatcher';

describe('runAction', () => {
  it('executes an action', function () {
    this.expected = 10;
    const payload = { foo: [] },
      factory     = () => {
        return {
          EVENT_NAME: (publish, item) => publish({ foo: item })
        }
      };

    sinon.stub(Dispatcher, 'dispatch');
    runAction('EVENT_NAME', factory, [[]]);

    expect(Dispatcher.dispatch.calledOnce).to.equal(true);
    expect(Dispatcher.dispatch.calledWith('EVENT_NAME', payload)).to.equal(true);

    Dispatcher.dispatch.restore();
  });

  it('dispatches multiple actions', function () {
    this.expected = 5;
    const payload = { foo: [] },
      factory     = () => {
        return {
          EVENT_NAME: (publish, item) => runAction('OTHER', factory, [item]),
          OTHER:      (publish, item) => publish({ foo: item })
        }
      };

    sinon.stub(Dispatcher, 'dispatch');
    runAction('EVENT_NAME', factory, [[]]);

    expect(Dispatcher.dispatch.calledOnce).to.equal(true);
    expect(Dispatcher.dispatch.calledWith('OTHER', payload)).to.equal(true);
    expect(Dispatcher.dispatch.calledWith('EVENT_NAME', payload)).to.equal(false);

    Dispatcher.dispatch.restore();
  });
});
