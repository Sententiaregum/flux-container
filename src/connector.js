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
import EventEmitter from 'events';

const list = [];

/**
 * Connection API which creates view listeners that can react on a refreshed store.
 *
 * @param {Object} store The store which should be handled by the view.
 *
 * @returns {{subscribe:Function,unsubscribe:Function,register:Function}} The internal connection API.
 */
export default store => {
  /**
   * Manual modification of the emitter.
   * This function handles how the emitter is managed in the connection API.
   *
   * @param {Function} handler The handler to be called in case of flushing changes.
   * @param {String}   type    The type (e.g. addListener/removeListener).
   *
   * @returns {void}
   */
  function modifyEmitter(handler, type) {
    invariant(
      isStoreKnown(store),
      'The store is not registered! Please use the `store()` function to assemble a store properly and register it automatically!'
    );
    invariant(
      typeof handler === 'function',
      'The store handler must be a function!'
    );

    getEmitter(store)[type]('change', handler);
  }

  /**
   * Checks whether the list is aware of the store passed as argument.
   *
   * @param {Object} store The store to check.
   *
   * @returns {boolean}
   */
  function isStoreKnown(store) {
    return list.length > 0 && list.some(item => item[0] === store);
  }

  /**
   * Checks for the emitter.
   *
   * @param {Object} store The store associated to the emitter.
   *
   * @returns {EventEmitter}
   */
  function getEmitter(store) {
    return list.find(item => item[0] === store ? item : false)[1];
  }

  return new class {
    /**
     * Associates the handler with the given store.
     *
     * @param {Function} handler The handler to check.
     *
     * @returns {void}
     */
    subscribe(handler) {
      modifyEmitter(handler, 'addListener');
    }

    /**
     * Unsubscribes the handler with the given store.
     *
     * @param {Function} handler The handler to check.
     *
     * @returns {void}
     */
    unsubscribe(handler) {
      modifyEmitter(handler, 'removeListener');
    }

    /**
     * API for the registration of the store.
     *
     * @param {EventEmitter} emitter Emitter.
     *
     * @returns {void}
     */
    register(emitter) {
      invariant(
        emitter instanceof EventEmitter,
        'Emitter must be node\'s core emitter!'
      );

      if (!isStoreKnown(store)) {
        list.push([store, emitter]);
      }
    }
  }
}
