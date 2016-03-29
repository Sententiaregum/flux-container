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
import connect from './util/connect';

/**
 * Abstract base store class which connects a store with the dispatcher.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * @abstract
 */
export default class BaseStore {
  /**
   * Constructor.
   *
   * @returns {void}
   */
  constructor() {
    this.tokens = {};
  }

  /**
   * Initializes the store:
   * This method retrieves the data from the event subscription and connects it to the dispatcher.
   *
   * @returns {void}
   */
  init() {
    this.tokens = connect(this, this.getSubscribedEvents());
  }

  /**
   * Builds the event data configuration.
   *
   * @returns {Array.<Object>} The event data.
   */
  getSubscribedEvents() {
    invariant(
      false,
      'This method is abstract and must be overriden by the parent!'
    )
  }

  /**
   * Retrieves a token by the event it listens to.
   *
   * @param {String} eventName The event name.
   *
   * @returns {String} The token which listens to the event.
   */
  getDispatchTokenByEventName(eventName) {
    invariant(
      typeof this.tokens[eventName] !== 'undefined',
      `No callback is registered for event ${eventName} in that store!`
    );

    return this.tokens[eventName];
  }
}
