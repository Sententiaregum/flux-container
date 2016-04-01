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
import createDispatcherCallback from './createDispatcherCallback';
import AppDispatcher from '../AppDispatcher';

/**
 * Util which connects the event hub to the dispatcher.
 *
 * @param {Array.<Object>} eventData The event configuration.
 *
 * @returns {Object.<String>} Key-value list from event to dispatch token.
 */
export default function connect(eventData) {
  const tokens = {};
  eventData.forEach(config => {
    invariant(
      Object.keys(tokens).indexOf(config.name) === -1,
      `Cannot attach multiple listeners to event "${config.name}"!`
    );

    tokens[config.name] = AppDispatcher.addListener(
      config.name,
      createDispatcherCallback(config),
      typeof config.dependencies !== 'undefined' ? config.dependencies : []
    );
  });

  return tokens;
}
