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
import DispatchStateStore from './store/DispatchStateStore';
import StoreList from './store/StoreList';
import StoreViewConnector from './store/StoreViewConnector';

const list = new StoreList();

/**
 * Connection API which creates view listeners that can react on a refreshed store.
 *
 * @param {DispatchStateStore} store The store which should be handled by the view.
 *
 * @returns {StoreViewConnector} The internal connection API.
 */
export default function connector(store) {
  invariant(
    store instanceof DispatchStateStore,
    'In order to work properly, the store must be an instance of DispatchStateStore!'
  );

  return new StoreViewConnector(store, list);
}
