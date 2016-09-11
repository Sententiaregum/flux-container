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

import Dispatcher from './dispatcher/Dispatcher';
import invariant from 'invariant';

/**
 * Executes the action of an action creator to abstract the dispatcher from the public API.
 *
 * It takes one action creator and connects it with the dispatcher, so it can do sync or async actions
 * and publish the payload after that.
 *
 * @param {String}   eventName     The event to execute.
 * @param {Function} actionCreator The action.
 * @param {Array}    args          Argument list.
 *
 * @returns {void}
 */
export default (eventName, actionCreator, args = []) => {
  invariant(
    typeof actionCreator === 'function',
    'The `actionCreator` must be a function that builds the actions.'
  );

  // To create the action creator a dispatcher callback is needed.
  // This callback simply takes the event name and the given payload that is injected into the callback
  // as argument and delegates it to the `Dispatcher`.
  actionCreator(payload => Dispatcher.dispatch(eventName, payload))[eventName](...args);
}
