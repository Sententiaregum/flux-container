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

let _state;

/**
 * Internal store API containing the state of a store.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 */
export default class DispatchStateStore {
  /**
   * Constructor.
   *
   * @returns {void}
   */
  constructor() {
    this.tokens = {};
  }

  /**
   * Getter for the internal state.
   *
   * @returns {any} The internal state.
   */
  getState() {
    return _state;
  }

  /**
   * Returns a dispatch token for a certain event.
   *
   * @param {String} eventName Event name.
   *
   * @returns {String} The dispatch token.
   */
  getToken(eventName) {
    invariant(
      eventName in this.tokens,
      `A handler for event name "${eventName}" must be registered in this store!`
    );
    return this.tokens[eventName];
  }

  /**
   * Setter for the internal state.
   *
   * @param {any} newState The new state.
   *
   * @returns {DispatchStateStore}
   * @private
   */
  _setState(newState) {
    _state = newState;
    return this;
  }

  /**
   * Sets token.
   *
   * @param {Object.<String>} tokens The event names being associated to the dispatch tokens of the store.
   *
   * @returns {DispatchStateStore}
   * @private
   */
  _setTokens(tokens) {
    this.tokens = tokens;
    return this;
  }
}
