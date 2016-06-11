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

import DispatchStateStore from './store/DispatchStateStore';
import createStoreRefreshHandler from './util/createStoreRefreshStateHandler';
import EventEmitter from 'events';
import connect from './util/connect';
import connector from './connector';
import composite from './store/composite';

/**
 * Creates a flux store.
 *
 * @param {Object} subscriptions The configured subscriptions.
 * @param {any}    initialState  The initial state or callback handler.
 *
 * @returns {DispatchStateStore}
 */
export default function store(subscriptions, initialState) {
  const store  = new DispatchStateStore(), emitter = new EventEmitter();
  const tokens = connect(
    Object.keys(subscriptions).map(eventName => {
      const subscription = subscriptions[eventName];
      if (!subscription.params) {
        subscription.params = [];
      }

      const values = {
        name:     eventName,
        function: createStoreRefreshHandler(store, emitter, subscription),
        params:   subscription.params
      };

      if (subscription.dependencies) {
        values.dependencies = subscription.dependencies;
      }
      return values;
    })
  );

  composite().saveStore(store, prepareInitialState(initialState));
  store.tokens = tokens;

  // make tokens immutable
  Object.freeze(store.tokens);

  connector(store).register(emitter);
  return store;
}

/**
 * Factory for the initial state.
 *
 * @param {*} stateParam The initial state.
 *
 * @returns {*} The transformed state.
 */
function prepareInitialState(stateParam) {
  return typeof stateParam === 'function' ? stateParam() : stateParam;
}
