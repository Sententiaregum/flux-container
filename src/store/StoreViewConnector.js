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

/**
 * Generic connector object that connects the store with the view.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 */
export default class StoreViewConnector {
  /**
   * Constructor.
   *
   * @param {DispatchStateStore} store The store to handle.
   * @param {StoreList}          list  The list of known stores.
   */
  constructor(store, list) {
    this.store = store;
    this.items = list;
  }

  /**
   * Associates the handler with the given store.
   *
   * @param {Function} handler The handler to check.
   *
   * @returns {void}
   */
  useWith(handler) {
    this._doModifyEmitter(handler, 'addListener');
  }

  /**
   * Unsubscribes the handler with the given store.
   *
   * @param {Function} handler The handler to check.
   *
   * @returns {void}
   */
  unsubscribe(handler) {
    this._doModifyEmitter(handler, 'removeListener');
  }

  /**
   * API for the registration of the store.
   *
   * @param {EventEmitter} emitter Emitter.
   *
   * @returns {StoreViewConnector} To provide a fluent API.
   */
  register(emitter) {
    this.items.register(this.store, emitter);
    return this;
  }

  /**
   * Manual modification of the emitter.
   *
   * @param {Function} handler The handler to be called in case of flushing changes.
   * @param {String}   type    The type (e.g. addListener/removeListener).
   *
   * @returns {void}
   * @private
   */
  _doModifyEmitter(handler, type) {
    invariant(
      -1 !== ['addListener', 'removeListener'].indexOf(type),
      'The store handling type must be either `on` or `off`!'
    );
    invariant(
      this.items.isStoreKnown(this.store),
      'The store is not registered! Please use the `store()` function to assemble a store properly and register it automatically!'
    );
    invariant(
      typeof handler === 'function',
      'The store handler must be a function!'
    );

    this.items.getEmitter(this.store)[type]('change', handler);
  }
}
