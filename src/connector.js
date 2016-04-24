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
import BaseStore from './BaseStore';

/**
 * Connection API which creates view listeners that can react on a refreshed store.
 *
 * @param {BaseStore} store The store which should be handled by the view.
 *
 * @returns {Object} The internal connection API.
 */
export default function connector(store) {
  invariant(
    store instanceof BaseStore,
    'In order to work properly, the store must be an instance of BaseStore!'
  );

  return createAPI(store);
}

/**
 * Factory which builds the connection API.
 *
 * @param {BaseStore} store The store.
 *
 * @returns {Object} The handler.
 */
function createAPI(store) {
  return {
    useWith:     createHandler(store, 'addListener'),
    unsubscribe: createHandler(store, 'removeListener')
  };
}

/**
 * Creates a handler which is responsible for the store <> view connection.
 *
 * @param {BaseStore} store The store.
 * @param {String}    type  The handling type (either `on` or `off`)
 * 
 * @returns {Function} A handler of the connection API.
 */
function createHandler(store, type) {
  invariant(
    -1 !== ['addListener', 'removeListener'].indexOf(type),
    'The store handling type must be either `on` or `off`!'
  );
  return handler => {
    invariant(
      typeof handler === 'function',
      'The store handler must be a function!'
    );
    store[type](store.CHANGE_EVENT, handler);
  };
}
