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

import { Component } from 'react';
import invariant from 'invariant';
import BaseStore from './BaseStore';

/**
 * Abstract react component which provides a api for app components to connect to stores
 * flushing their state changes back to this component.
 *
 * @author Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * @abstract
 */
export default class BaseComponent extends Component {
  /**
   * Constructor.
   *
   * @param {Object} props       Component properties.
   * @param {Array}  storeConfig Configuration for the store <> connection.
   *
   * @returns {void}
   */
  constructor(props, storeConfig) {
    super(props);
    this.config = storeConfig;
  }

  /**
   * Attaches the stores on the view.
   *
   * @returns {void}
   */
  componentDidMount() {
    this.config.forEach(config => {
      ['store', 'handler'].forEach(parameter => {
        invariant(
          typeof config[parameter] !== 'undefined',
          `Missing config property "${parameter}"!`
        );
      });
      invariant(
        config.store instanceof BaseStore,
        'In order to work properly, the store must be an instance of BaseStore!'
      );

      config.store.on(config.store.CHANGE_EVENT, config.handler);
    });
  }

  /**
   * Detaches the stores from the view.
   *
   * @returns {void}
   */
  componentWillUmount() {
    this.config.forEach(config => {
      config.store.removeListener(config.store.CHANGE_EVENT, config.handler);
    });
  }
}
