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

import createStoreRefreshHandler from './util/createStoreRefreshStateHandler';
import EventEmitter from 'events';
import connect from './util/connect';
import connector from './connector';
import invariant from 'invariant';
import deepEqual from 'deep-equal';

/**
 * Creates a flux store.
 *
 * @param {Object} subscriptions The configured subscriptions.
 * @param {*}      initialState  The initial state or callback handler.
 *
 * @returns {{getState:Function,getStateValue:Function,getToken:Function}}
 */
export default (subscriptions, initialState) => {
  let state = initialState;

  const emitter = new EventEmitter();
  const tokens  = connect(
    Object.keys(subscriptions).map(eventName => {
      const subscription = subscriptions[eventName];
      if (!subscription.params) {
        subscription.params = [];
      }

      return {
        name:         eventName,
        function:     createStoreRefreshHandler(getStateSaveHandler(), emitter, subscription),
        params:       subscription.params,
        dependencies: typeof subscription.dependencies === 'undefined' ? subscription.dependencies : []
      };
    })
  );

  /**
   * Factory which creates a function that updates state if something changed.
   *
   * @returns {Function} The change handler.
   */
  function getStateSaveHandler() {
    return newState => {
      if (deepEqual(newState, state)) {
        return false;
      }

      state = newState;
      return true;
    };
  }

  /**
   * Evaluates a property path written as dot notation.
   * So "foo.bar.baz" will be evaluated as o['foo']['bar']['baz'].
   *
   * @param {Array|Object} state The state to evaluate.
   * @param {String}       path  The property path.
   *
   * @returns {*} The result of the path evaluation.
   */
  function evaluatePropertyPath(state, path) {
    invariant(
      Array.isArray(state) || typeof state === 'object',
      'To evaluate a property path, the value must be an object or an array!'
    );

    return path.split('.').reduce((o, i) => {
      if (typeof o === 'undefined' || typeof o[i] === 'undefined') {
        return;
      }
      return o[i];
    }, state);
  }

  /**
   * Evaluates the state inline.
   * The state might be a lazy callback, so it needs to be checked whether this is true or
   * the state can be returned as-is.
   *
   * @param {*} state The state to evaluate.
   *
   * @returns {*} The evaluated state.
   */
  function evaluateState(state) {
    return typeof state === 'function' ? state() : state;
  }

  return new class {
    /**
     * Constructor.
     * Instantiates the class and registers the store's instance at the store<>view connector.
     *
     * @returns {void}
     */
    constructor() {
      connector(this).register(emitter);
    }

    /**
     * Getter for the store's internal state.
     * The state built by an internal handler will be stored as local variable in the store's scope.
     * A function might be returned which will be executed lazily when the state needs to be received.
     *
     * @returns {*}
     */
    getState() {
      return state = evaluateState(state);
    }

    /**
     * In a lot of cases a single item of the state is needed, nothing more.
     * To fulfill this use-case this provider returns a single value of the state and provides
     * a default value if the item can't be received.
     *
     * @param {String} path         The property path.
     * @param {*}      defaultValue The default value.
     *
     * @returns {*} The value of the state to be fetched.
     */
    getStateValue(path, defaultValue = null) {
      const search = evaluatePropertyPath(this.getState(), path);
      if (typeof search === 'undefined') {
        return defaultValue;
      }

      return search;
    }

    /**
     * Provider for a dispatch token.
     * The store listens to certain actions published by the dispatcher. Every event handler has its own
     * ID generated by the dispatcher. To declare proper callback dependencies, this token is needed.
     *
     * @param {String} eventName The event name to look for.
     *
     * @returns {String}
     */
    getToken(eventName) {
      invariant(
        eventName in tokens,
        `A handler for event name "${eventName}" must be registered in this store!`
      );
      return tokens[eventName];
    }
  };
}
