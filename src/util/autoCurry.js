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

/**
 * Simple auto-curry utility.
 *
 * @returns {Function} A function which handles the auto currying.
 * @private This is part of the internal API and should not be used directly!
 */
export default () => {
  let normalized = [];
  return function step(...args) {
    if (args.length === 0) {
      return normalized;
    }
    normalized = normalized.concat(args);
    return step;
  };
};
