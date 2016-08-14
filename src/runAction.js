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

import AppDispatcher from './dispatcher/AppDispatcher';
import invariant from 'invariant';

/**
 * Executes the action of a action creator to abstract the dispatcher from the public API.
 *
 * It takes one action creator and connects it with the dispatcher, so it can do sync or async actions
 * and publish the payload after that.
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

  actionCreator(...args)((alias, payload) => AppDispatcher.dispatch(alias, payload));
}
