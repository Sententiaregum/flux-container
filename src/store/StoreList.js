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

/**
 * Container for stores and their corresponding event emitters.
 *
 * @private This is part of the internal API and should not be used directly!
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 */
export default class StoreList {
  /**
   * Constructor.
   *
   * @returns {void}
   */
  constructor() {
    this._stores = [];
  }

  /**
   * Checks whether the list is aware of the store passed as argument.
   *
   * @param {DispatchStateStore} store The store to check.
   *
   * @returns {boolean}
   */
  isStoreKnown(store) {
    return this._stores.length > 0 && this._stores.some(item => item[0] === store);
  }

  /**
   * Checks for the emitter.
   *
   * @param {DispatchStateStore} store The store associated to the emitter.
   *
   * @returns {EventEmitter}
   */
  getEmitter(store) {
    return this._stores[this._stores.findIndex(item => item[0] === store ? item : false)][1];
  }

  /**
   * Registers a new store.
   *
   * @param {DispatchStateStore} store   The store to register.
   * @param {EventEmitter}       emitter The event emitter associated with the store.
   *
   * @returns {void}
   */
  register(store, emitter) {
    invariant(
      emitter instanceof EventEmitter,
      'Emitter must be node\'s core emitter!'
    );
    if (!this.isStoreKnown(store)) {
      this._stores.push([store, emitter]);
    }
  }
}
