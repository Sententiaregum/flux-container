/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import connector from '../../src/connector';
import sinon from 'sinon';
import { expect } from 'chai';
import Dispatcher from '../../src/dispatcher/Dispatcher';
import { subscribe, runAction, store }  from '../../src/index';
import { chain } from '../../src/subscribe';

describe('functional::FluxLifecycle', () => {
  afterEach(() => {
    Dispatcher.reset();
  });

  const actionCreator = () => {
    return {
      EVENT: (publish, arg1 = 'bar') => publish({
        foo:  arg1,
        blah: 'baz'
      })
    };
  };

  // due to the fact that the implementation grows and grows
  // it is better to have a functional test verifying all the components in one big test
  it('handles one-way data flow correctly', function () {
    this.expected = 20;

    const eventStore = store({
      'EVENT': subscribe(chain()(handle))
    }, {});

    function handle({ foo, blah }) {
      return { param1: foo, param2: blah };
    }

    const handler = sinon.spy();
    connector(eventStore).subscribe(handler);

    runAction('EVENT', actionCreator, []);
    expect(handler.calledOnce).to.equal(true);
    expect(eventStore.getState().param1).to.equal('bar');
    expect(eventStore.getState().param2).to.equal('baz');
  });

  it('keeps the old state up to date', function () {
    this.expected = 20;

    const handler = (state, oldState) => {
      expect(oldState).to.deep.equal(count === 1 ? {} : { foo: 'bar', blah: 'baz' });
      return state;
    };

    let count        = 1;
    const eventStore = store({
      'EVENT': subscribe(chain()(handler))
    }, {});

    runAction('EVENT', actionCreator, []);

    expect(eventStore.getState().foo).to.equal('bar');
    expect(eventStore.getState().blah).to.equal('baz');

    count++;
    runAction('EVENT', actionCreator, ['blah']);

    expect(eventStore.getState().foo).to.equal('blah');
  });
});
