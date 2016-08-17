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
import AppDispatcher from '../dispatcher/AppDispatcher';

/**
 * Util which connects the event hub to the dispatcher.
 *
 * @param {Array.<Object>} eventData The event configuration.
 *
 * @returns {Object.<String>} Key-value list from event to dispatch token.
 * @private This is part of the internal API and should not be used directly!
 */
export default function connect(eventData) {
  const tokens = {};

  /**
   * Factory which creates a callback that listens to the dispatcher.
   * The event config schema must look like this:
   *
   * <code>
   *   { name: EVENT_NAME, function: () => {}, params: ['params', 'in', 'the', 'payload'] }
   * </code>
   *
   * @param {Object} eventConfiguration The configuration of the event to subscribe.
   *
   * @returns {Function} The callback.
   * @private This is part of the internal API and should not be used directly!
   */
  function createDispatcherCallback(eventConfiguration) {
    ['name', 'function', 'params'].forEach(field => {
      invariant(
        typeof eventConfiguration[field] !== 'undefined',
        `Required property "${field}" missing in event config!`
      );
    });

    return payload => {
      const params = [];
      eventConfiguration.params.forEach(param => {
        invariant(
          typeof payload[param] !== 'undefined',
          `Required payload parameter "${param}" is missing!`
        );
        params.push(payload[param]);
      });

      eventConfiguration.function(...params);
    };
  }

  // handle event data and build tokens
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
