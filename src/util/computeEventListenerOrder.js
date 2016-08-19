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
 * Sorts the given listeners by its order.
 *
 * @param {Object} listeners The listeners to be triggered at one event.
 *
 * @returns {Array.<Function>} The ordered callback chain.
 * @private This is part of the internal API and should not be used directly!
 */
export default (listeners) => {
  let _store = listeners,
    _ids     = Object.keys(_store);

  /**
   * Creates a graph of dependencies based on a given base.
   *
   * The graph computer tries to find non-managed dependencies (root dependency or not required by an already processed one)
   * and then its dependencies will be evaluated and appended to the execution tree.
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
      checkEdges(token, known);

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
   * Checks if the an edge-token is corrupted or already processed.
   *
   * Validates the edges and ensures that no edge will be duplicated as this'll cause circular references and
   * endless loops.
   *
   * @param token
   * @param {Array.<String>} known List of already
   *
   * @returns {void}
   */
  function checkEdges(token, known) {
    invariant(
      -1 !== _ids.indexOf(token),
      `Token "${token}" is not registered as listener!`
    );
    invariant(
      -1 === known.indexOf(token),
      `Circular reference detected: Token "${token}" is already processed!`
    );
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
   *
   * This is necessary in order to avoid duplicated executions during the graph computation.
   * It iterates over the dependencies of items present in the graph or sub-graph provided as second argument
   * and checks if the token is already processed in this graph as dependency.
   *
   * @param {String} token The token.
   * @param {Array}  graph The current graph.
   *
   * @returns {boolean}
   */
  function isProcessed(token, graph) {
    return [].concat(...graph.map(data => data.dependencies)).indexOf(token) !== -1;
  }

  /**
   * Checks whether one item is duplicated.
   *
   * It might be possible that multiple roots exist and both need a certain callback. To achieve that, this callback
   * must be executed before, but MUST not be executed both.
   * One chain might look like this:
   *
   * A --> B <-- C
   *
   * In this case A and C would be roots and both would include B in its subtree, but it should be avoided to execute
   * it two times.
   *
   * @param {String} token The token to validate.
   * @param {Array}  graph The dependency graph.
   *
   * @returns {boolean} Whether or not duplicated.
   */
  function isDuplicated(token, graph) {
    return !graph.every(data => data !== _store[token]);
  }

  // build execution tree
  const result = Object.keys(_store).reduce((prev, id) => {
    if (isForeignDependency(id) || isProcessed(id, prev)) {
      return prev;
    }
    const data = listeners[id];
    return prev.concat(createDependencyGraph(data.dependencies, [], prev, []).concat([data]));
  }, []);

  // there's an absolute length of IDs and if it doesn't match the length of the execution
  // tree not all callbacks are managed. This might happen if a dependency cycle exists which
  // look looks like this: A -> B -> A.
  // In this case the resolver can't figure out where to start as the first dependency in the chain must
  // not have any dependencies.
  invariant(
    _ids.length === result.length,
    'No root dependency detected!'
  );

  // Internally a config object is built, but the dispatcher expects no configuration created by the
  // private API, but a flat list of callbacks.
  return result.map(config => config.callback);
}
