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

import AppDispatcher from './AppDispatcher';
import invariant from 'invariant';

/**
 * Creates the action.
 *
 * @param {Function} actionCreator The action.
 * @param {Array}    args          The factory arguments.
 *
 * @returns {Function}
 */
function getAction(actionCreator, args) {
  return actionCreator(...args);
}

/**
 * Executes the action of a action creator to abstract the dispatcher from the public API.
 *
 * @param {Function} actionCreator The action.
 * @param {Array}    args          Argument list.
 *
 * @returns {void}
 */
export default function runAction(actionCreator, args) {
  invariant(
    typeof actionCreator === 'function',
    'The `actionCreator` must be a function factoring an action.'
  );

  const action = getAction(actionCreator, args), handle = (alias, payload) => {
    AppDispatcher.dispatch(alias, payload);
  };
  action(handle);
};
