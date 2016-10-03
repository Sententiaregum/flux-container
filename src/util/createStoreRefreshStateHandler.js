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

import EventEmitter from 'events';
import invariant from 'invariant';

/**
 * Handler which creates a callback that handles the state refresh of a store from a dispatcher
 * and flushes it into the view.
 *
 * @param {Function}        saveHandler The handler provided by the store to save all the data.
 * @param {EventEmitter}    emitter     The event emitter.
 * @param {Object.<String>} eventConfig The configuration of the event to handle.
 * @param {*}               oldState    The old state of the store.
 *
 * @returns {Function} The refreshing handler.
 * @private This is part of the internal API and should not be used directly!
 */
export default function createStoreRefreshStateHandler(saveHandler, emitter, eventConfig, oldState) {
  invariant(
    emitter instanceof EventEmitter,
    'The emitter must be an instance of node\'s core event emitter!'
  );

  const modifySubsection = (subsection, state, oldState) => Object.assign({}, oldState, {
    [subsection]: Array.isArray(oldState[subsection]) && Array.isArray(state) ? oldState[subsection].concat(state) : state
  });

  /**
   * Lightweight handler which evaluates the new state for a store based on the configuration for a store
   * and the dispatched payload.
   *
   * This function covers the following cases:
   * - an array with strings (modify a subsection of the current state snapshot) and handlers (modify the state with a function).
   * - no function (the payload will be interpreted as state).
   *
   * @param {*} state The newly dispatched payload.
   *
   * @returns {*} The evaluated result.
   */
  function handleState(state) {
    if (!eventConfig.function) {
      return state;
    }

    if (typeof eventConfig.function === 'function') {
      return eventConfig.function(state, oldState);
    }

    invariant(
      Array.isArray(eventConfig.function) && eventConfig.function.length > 0,
      'The `function` value must be a non-empty array!'
    );

    return eventConfig.function.reduce((prevState, handler) => {
      if (typeof handler === 'function') {
        return handler(state, oldState);
      }

      return modifySubsection(handler, state, oldState);
    }, state);
  }

  return state => {
    if (saveHandler(handleState(state))) {
      emitter.emit('change');
    }
  };
}
