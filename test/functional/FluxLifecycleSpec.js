/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import runAction from '../../src/runAction';
import connector from '../../src/connector';
import store from '../../src/store';
import sinon from 'sinon';
import { expect } from 'chai';
import Dispatcher from '../../src/dispatcher/Dispatcher';

describe('functional::FluxLifecycle', () => {
  afterEach(() => {
    Dispatcher.reset();
  });

  // due to the fact that the implementation grows and grows
  // it is better to have a functional test verifying all the components in one big test
  it('handles one-way data flow correctly', () => {
    const actionCreator = publish => {
      return {
        EVENT: () => publish({
          foo:  'bar',
          blah: 'baz'
        })
      };
    };

    const eventStore = store({
      'EVENT': {
        params: ['foo', 'blah'],
        function: handle
      }
    }, {});

    function handle(foo, blah) {
      return Object.assign({ param1: foo, param2: blah }, eventStore.getState());
    }

    const handler = sinon.spy();
    connector(eventStore).subscribe(handler);

    runAction('EVENT', actionCreator, []);
    expect(handler.calledOnce).to.equal(true);
    expect(eventStore.getState().param1).to.equal('bar');
    expect(eventStore.getState().param2).to.equal('baz');
  });

  it('skips update if no state modification is given', () => {
    const actionCreator = publish => {
      return {
        EVENT: () => publish({
          foo: 'bar',
        })
      };
    };

    const eventStore = store({
      'EVENT': {
        params:   ['foo'],
        function: (foo) => ({ foo })
      }
    }, { foo: 'bar' });

    const handler = sinon.spy();
    connector(eventStore).subscribe(handler);

    runAction('EVENT', actionCreator, []);

    expect(handler.called).to.equal(false);
    expect(eventStore.getStateValue('foo')).to.equal('bar');
  });
});
