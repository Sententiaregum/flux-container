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

var _store, _ids;

/**
 * Sorts the given listeners by its order.
 *
 * @param {Object} listeners The listeners to be triggered at one event.
 *
 * @returns {Array.<Function>} The ordered callback chain.
 */
function computeOrder(listeners) {
  _store = listeners;
  _ids = Object.keys(_store);

  let result = [];
  for (let id in _store) {
    // incomplete graphs must be avoided.
    // this condition skips the order computation of any non-root dependency.
    if (!_store.hasOwnProperty(id) || isForeignDependency(id) || isProcessed(id, result)) {
      continue;
    }

    const data = listeners[id],
        dependencies = data.dependencies,
        graph = createDependencyGraph(dependencies, [], result, []).concat([data]);

    result = result.concat(graph);
  }

  invariant(
    _ids.length === result.length,
    'No root dependency detected!'
  );

  return flattenListeners(result);
}

/**
 * Creates a graph of dependencies based on a given base.
 *
 * @param {Array.<String>} dependencies        List of dependencies of the base listener.
 * @param {Array.<String>} known               List of already processed items in order to avoid a cycle.
 * @param {Array}          currentGraphSnippet Snapshot of the base graph.
 * @param {Array}          parentGraph         Snapshot of the graph above the current token.
 *
 * @returns {Array.<String>} The dependency graph based on
 */
function createDependencyGraph(dependencies, known, currentGraphSnippet, parentGraph) {
  let graph = [];
  dependencies.forEach(token => {
    invariant(
      -1 !== _ids.indexOf(token),
      `Token "${token}" is not registered as listener!`
    );
    invariant(
      -1 === known.indexOf(token),
      `Circular reference detected: Token "${token}" is already processed!`
    );

    if (!isProcessed(token, currentGraphSnippet) && !isProcessed(token, parentGraph) && !isDuplicated(token, graph)) {
      const config = _store[token];
      if (config.dependencies.length > 0) {
        graph = graph.concat(createDependencyGraph(
          config.dependencies,
          known.concat([token]),
          currentGraphSnippet,
          graph
        ));
      }

      graph.push(config);
    }
  });

  return graph;
}

/**
 * Flattens the list of listeners.
 *
 * @param {Array} data The listener config.
 *
 * @returns {Array.<Function>} The list of listener callbacks.
 */
function flattenListeners(data) {
  return data.map(config => config.callback);
}

/**
 * Checks whether the given dependency is used by other items.
 *
 * @param {String} token ID.
 *
 * @returns {boolean} Whether or not.
 */
function isForeignDependency(token) {
  return isProcessed(token, _ids.map(key => _store[key]));
}

/**
 * Checks whether the item is already processed.
 * This is necessary in order to avoid duplicated executions during the graph computation.
 *
 * @param {String} token The token.
 * @param {Array}  graph The current graph.
 *
 * @returns {boolean}
 */
function isProcessed(token, graph) {
  const eventData = graph.map(data => data.dependencies);
  const deps = [].concat(...eventData);

  return deps.indexOf(token) !== -1;
}

/**
 * Checks whether one item is duplicated.
 *
 * @param {String} token The token to validate.
 * @param {Array}  graph The dependency graph.
 *
 * @returns {boolean} Whether or not duplicated.
 */
function isDuplicated(token, graph) {
  const object = _store[token];
  return !graph.every(data => data !== object);
}

export default computeOrder;
