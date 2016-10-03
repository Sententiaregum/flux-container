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
import Dispatcher from '../dispatcher/Dispatcher';

/**
 * Util which connects the event hub to the dispatcher.
 *
 * @param {Object.<Object>} eventData The event configuration.
 *
 * @returns {Object.<String>} Key-value list from event to dispatch token.
 * @private This is part of the internal API and should not be used directly!
 */
export default (eventData) => {
  const tokens = {};

  // handle event data and build tokens
  Object.keys(eventData).forEach(name => {
    const config = eventData[name];
    invariant(
      typeof config['function'] !== 'undefined',
      `Required property "function" missing in event config!`
    );

    tokens[name] = Dispatcher.addListener(
      name,
      payload => config.function(payload),
      config.dependencies
    );
  });

  return tokens;
}
