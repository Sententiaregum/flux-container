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

import autoCurry from './util/autoCurry';

/**
 * Simple helper utility which creates an event subscription.
 *
 * @param {Function} chain        The chain of handlers.
 * @param {Array}    dependencies The event dependencies.
 *
 * @returns {Object} The subscription.
 */
export default (chain = null, dependencies = []) => {
  if (!chain) {
    return { dependencies };
  }
  return {
    dependencies,
    function: chain()
  };
};

export { autoCurry as chain };
