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

/**
 * Combines two arrays to an object.
 * Behaves like PHP's `array_combine()`
 *
 * @param {Array.<String>} params The parameters.
 * @param {Array}          args   The args.
 *
 * @returns {Object} The resulting object.
 */
export default function combine(params, args) {
  invariant(
    params.length === args.length,
    'The length of the keys must match the length of the args!'
  );

  return args.reduce((previous, current, index) => {
    previous[params[index]] = current;
    return previous;
  }, {});
}
