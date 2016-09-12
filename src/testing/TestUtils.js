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

import invariant from 'invariant';
import deepEqual from 'deep-equal';
import runAction from '../runAction';
import Dispatcher from '../dispatcher/Dispatcher';

/**
 * Builds an error message for failed assertions.
 *
 * @param {String} kind     Which kind of data mismatched.
 * @param {*}      expected Expected dataset.
 * @param {*}      actual   Actual dataset.
 *
 * @returns {String} The error message.
 */
function getErrorMessage(kind, expected, actual) {
  return `Can't match the expected ${kind} (${JSON.stringify(expected)}) with actual ${kind} (${JSON.stringify(actual)})!`
}

/**
 * API for testing utility.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 */
export default new class {
  /**
   * Clear.
   *
   * As the dispatcher is an internal API which is stateful, it needs to be ensured that everything will be
   * cleared properly before running tests.
   *
   * @returns {void}
   */
  clear() {
    Dispatcher.reset();
  }

  /**
   * Executes an action and returns a function to match the payload.
   * This is helpful when unittesting the way how action creators should work.
   *
   * Example:
   *
   * describe('TestUtils', () => {
   *   it('single test', () => {
   *     TestUtils.executeAction(actionCreator, event, args)(expected);
   *   });
   * });
   *
   * @param {Function}  actionCreator The creator which should be tested.
   * @param {String}    event         The event of the action creator to be tested.
   * @param {Array.<*>} args          The arguments used in that event.
   *
   * @returns {Function} The function used assert the result.
   */
  executeAction(actionCreator, event, args) {
    this.clear();
    return (expected, events = [], dispatched = {}) => {
      let list = {};
      events.forEach(event => Dispatcher.addListener(event, payload => Object.assign(list, { [event]: payload })));
      actionCreator(payload => invariant(deepEqual(payload, expected), getErrorMessage('payload', expected, payload)))[event](...args);

      if (Object.keys(list).length > 0) {
        Object.keys(dispatched).forEach(event => {
          invariant(typeof list[event] !== 'undefined', `Missing event "${event}"!`);
          invariant(deepEqual(dispatched[event], list[event]), getErrorMessage('payload', dispatched[event], list[event]));
        });
      }
    };
  }

  /**
   * Uses the runAction API to check whether actions and stores interact correctly.
   * This sort of integrative tests is helpful when ensuring that the interaction between the components
   * behaves as expected.
   *
   * Example:
   *
   * describe('TestUtils', () => {
   *   it('single test', () => {
   *     TestUtils.executeAction(actionCreator, event, args)(expected, storeToValidate);
   *     // or
   *     TestUtils.executeAction(actionCreator, event, args)([expected1, expected2], [store1, store2]);
   *   });
   * });
   *
   * @param actionCreator
   * @param event
   * @param args
   * @returns {function(*=, *)}
   */
  executeFullWorkflow(actionCreator, event, args = []) {
    runAction(event, actionCreator, args);

    return (expected, stores) => {
      const compareWithState = (state, expected) => {
        invariant(deepEqual(expected, state), getErrorMessage('state', expected, state));
      };

      if (!Array.isArray(stores)) {
        compareWithState(stores.getState(), expected);
        return;
      }
      invariant(Array.isArray(expected), 'A list of expected values is needed when asserting against multiple stores!');
      stores.forEach((store, i) => compareWithState(store.getState(), expected[i]));
    };
  }
}
