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

import DispatchStateStore from '../store/DispatchStateStore';
import EventEmitter from 'events';
import invariant from 'invariant';
import combine from './combine';
import composite from '../store/composite';

/**
 * Handler which creates a callback that handles the state refresh of a store from a dispatcher
 * and flushes it into the view.
 *
 * @param {DispatchStateStore} store       The store.
 * @param {EventEmitter}       emitter     The event emitter.
 * @param {Object.<String>}    eventConfig The configuration of the event to handle.
 *
 * @returns {Function} The refreshing handler.
 * @private This is part of the internal API and should not be used directly!
 */
export default function createStoreRefreshStateHandler(store, emitter, eventConfig) {
  invariant(
    store instanceof DispatchStateStore,
    'The store must be an instance of "flux-container/store/DispatchStateStore"!'
  );
  invariant(
    emitter instanceof EventEmitter,
    'The emitter must be an instance of node\'s core event emitter!'
  );

  const payloadHandler = (typeof eventConfig.function === 'undefined')
    ? (...state) => combine(eventConfig.params, state)
    : eventConfig.function;

  return (...state) => {
    composite().saveStore(store, payloadHandler(...state));
    emitter.emit('change');
  };
}
