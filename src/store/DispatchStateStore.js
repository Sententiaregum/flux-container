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
import composite from './composite';

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
    return composite().getState(this);
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
}
