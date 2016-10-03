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

const creatorStore = [], objectStore = [];

/**
 * Resolves a single store.
 *
 * @param {Function} actionCreator The action creator to resolve.
 *
 * @returns {Object} The action dictionary.
 */
export default actionCreator => {
  const i = creatorStore.indexOf(actionCreator);
  if (-1 === i) {
    const result = actionCreator();
    creatorStore.push(actionCreator);
    objectStore.push(result);

    return result;
  }

  return objectStore[i];
}
