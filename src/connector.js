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

import StoreList from './store/StoreList';
import StoreViewConnector from './store/StoreViewConnector';

const list = new StoreList();

/**
 * Connection API which creates view listeners that can react on a refreshed store.
 *
 * @param {Object} store The store which should be handled by the view.
 *
 * @returns {StoreViewConnector} The internal connection API.
 */
export default (store) => {
  return new StoreViewConnector(store, list);
}
