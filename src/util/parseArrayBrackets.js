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
 * Simple helper which parses array brackets and transforms them into a dot notation to simplify the property path
 * evaluation in the store API.
 *
 * @param {String} string The string to evaluate.
 *
 * @returns {String} The evaluated string.
 */
export default string => {
  return string
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .replace(/\]\[/, '.')
    .replace(/\]\./, '.')
    .replace(/(\[)/, '.');
};
