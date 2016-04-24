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

import BaseStore from '../BaseStore';
import invariant from 'invariant';
import combine from './combine';

/**
 * Handler which creates a callback that handles the state refresh of a store from a dispatcher
 * and flushes it into the view.
 *
 * @param {BaseStore}       store       The store.
 * @param {Object.<String>} eventConfig The configuration of the event to handle.
 *
 * @returns {Function} The refreshing handler.
 */
export default function createStoreRefreshStateHandler(store, eventConfig) {
  invariant(
    store instanceof BaseStore,
    'The store must be an instance of "flux-container/BaseStore"!'
  );

  const payloadHandler = (typeof eventConfig.function === 'undefined')
    ? (...state) => combine(eventConfig.params, state)
    : eventConfig.function;

  return (...state) => {
    store.setState( payloadHandler(...state));
    store.emitChange();
  };
}
