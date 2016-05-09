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
import DispatchStateStore from './DispatchStateStore';

/**
 * Composite store which stores a store associated to its state.
 *
 * @private This is part of the internal API and should not be used directly!
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 */
export default class CompositeStore {
  /**
   * Constructor.
   *
   * @returns {void}
   */
  constructor() {
    this.stores = [];
  }

  /**
   * Saves a store and its state.
   *
   * @param {DispatchStateStore} store The store to save.
   * @param {any}                state The associated state.
   *
   * @returns {void}
   */
  saveStore(store, state) {
    invariant(
      store instanceof DispatchStateStore,
      `The store must be an instance of 'DispatchStateStore'!`
    );

    const index = this._getIndex(store);
    if (index > -1) {
      this.stores[index] = [store, state];
      return;
    }
    this.stores.push([store, state]);
  }

  /**
   * Getter for the state.
   *
   * @param {DispatchStateStore} store The store associated to the state.
   *
   * @returns {any} Returns the state of a store.
   */
  getState(store) {
    const index = this._getIndex(store);
    invariant(
      -1 !== index,
      'The index cannot be found since the store is not registered!'
    );

    return this.stores[index][1];
  }

  /**
   * Getter for the index.
   *
   * @param {DispatchStateStore} store The store.
   *
   * @returns {number}
   * @private
   */
  _getIndex(store) {
    return this.stores.findIndex(item => item[0] === store);
  }
}
