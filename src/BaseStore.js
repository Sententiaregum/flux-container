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
import EventEmitter from 'events';
import createStoreRefreshStateHandler from './util/createStoreRefreshStateHandler';

/**
 * Abstract base store class which connects a store with the dispatcher.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * @abstract
 */
export default class BaseStore extends EventEmitter {
  /**
   * Constructor.
   *
   * @returns {void}
   */
  constructor() {
    super();

    this.tokens       = {};
    this.state        = {};
    this.CHANGE_EVENT = 'CHANGE';
  }

  /**
   * Initializes the store:
   * This method retrieves the data from the event subscription and connects it to the dispatcher.
   *
   * @returns {void}
   */
  init() {
    this.tokens = this._connect();
  }

  /**
   * Builds the event data configuration.
   *
   * @returns {Array.<Object>} The event data.
   * @abstract
   */
  getSubscribedEvents() {
    invariant(
      false,
      'This method is abstract and must be overriden by the parent!'
    );
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
      `No callback is registered for event "${eventName}" in that store!`
    );

    return this.tokens[eventName];
  }

  /**
   * Flushes changes of the store to the view.
   *
   * @returns {void}
   */
  emitChange() {
    this.emit(this.CHANGE_EVENT);
  }

  /**
   * Connects the store with the dispatcher.
   *
   * @returns {Object.<String>} The tokens mapped to the event.
   * @private
   */
  _connect() {
    const store = this;
    return connect(this.getSubscribedEvents().map(config => {
      config.function = createStoreRefreshStateHandler(store, config);
      return config;
    }));
  }
}
