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

import StoreList from '../../src/store/StoreList';
import { expect } from 'chai';
import EventEmitter from 'events';

describe('store::StoreList', () => {
  it('detects invalid emitter', () => {
    class Store {}

    expect(() => {
      new StoreList().register(new Store(), {});
    }).to.throw('Emitter must be node\'s core emitter!');
  });

  it('saves stores properly', () => {
    class Store {
    }

    const instance = new StoreList(), store = new Store(), emitter = new EventEmitter();
    instance.register(store, emitter);
    expect(instance.isStoreKnown(store)).to.equal(true);
    expect(instance.getEmitter(store)).to.equal(emitter);
  });
});
