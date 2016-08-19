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
import computeEventListenerOrder from './../util/computeEventListenerOrder';

/**
 * Extended dispatcher which supports a better handling with data flows.
 *
 * This dispatcher attaches callbacks directly to events and calls them if the given
 * event is provided in Dispatcher#dispatch(). The dependencies
 * are a refactored approach of `waitFor()` which computes the proper order before executing
 * the callbacks, so a clear structure is provided and nothing will be changed during the actual dispatch.
 * As the dispatcher is stateless and stores callbacks only, parallel and recursive dispatches can
 * be done.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 */
class Dispatcher {
  /**
   * Constructor.
   *
   * @returns {void}
   */
  constructor() {
    this.reset();
  }

  /**
   * Adds a new listener for a certain event.
   *
   * @param {String}         eventName    Name of the event to listen on.
   * @param {Function}       callback     The actual callback hook.
   * @param {Array.<String>} dependencies Dependencies of the current listener.
   *
   * @returns {String} the ID of the callback.
   */
  addListener(eventName, callback, dependencies) {
    const id       = this._generateDispatchID(),
        deps       = typeof dependencies === 'undefined' ? [] : dependencies;
    this.store[id] = {
      eventName,
      callback,
      dependencies: deps
    };

    return id;
  }

  /**
   * Removes the event listener by its ID.
   *
   * @param {String} id ID of the hook.
   *
   * @returns {void}
   */
  removeListener(id) {
    invariant(
      typeof this.store[id] !== 'undefined',
      `The ID "${id}" must be present in the event store!`
    );

    delete this.store[id];
  }

  /**
   * Dispatches the payload to every callback which is subscribed to the given event name.
   *
   * @param {String} eventName The event name.
   * @param {Object} payload   The payload that every callback receives. 
   *
   * @returns {void}
   */
  dispatch(eventName, payload) {
    this._executeCallbackChain(computeEventListenerOrder(
      Object.keys(this.store).reduce((list, id) => {
        const config = this.store[id];
        if (eventName === config.eventName) {
          list[id] = config;
        }
        return list;
      }, {})
    ), payload);
  }

  /**
   * Resets the dispatcher.
   *
   * @returns {void}
   */
  reset() {
    this.counter = 1;
    this.store   = {};
  }

  /**
   * Executes a chain of callbacks.
   *
   * @param {Array}  chain   The chain of callbacks to execute.
   * @param {Object} payload The event payload.
   *
   * @returns {void}
   * @private
   */
  _executeCallbackChain(chain, payload) {
    chain.forEach(listener => listener(payload));
  }

  /**
   * Generates the ID of the next event hook.
   *
   * @returns {String} The hook ID.
   * @private
   */
  _generateDispatchID() {
    const id = `ID_${this.counter}`;
    this.counter++;

    return id;
  }
}

// the Dispatcher is a singleton, but resettable
export default new Dispatcher();
