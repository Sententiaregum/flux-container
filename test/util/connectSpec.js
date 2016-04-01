/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import connect from '../../src/util/connect';
import { expect } from 'chai';
import AppDispatcher from '../../src/AppDispatcher';

describe('util::connect', () => {
  beforeEach(() => {
    AppDispatcher.store   = {};
    AppDispatcher.counter = 1;
  });

  it('connects store listeners to the dispatcher', () => {
    const callback = () => {};
    const tokens = connect([
      {
        name: 'FOO',
        params: [],
        function: callback,
        dependencies: ['ID_2']
      }
    ]);

    expect(tokens['FOO']).to.equal('ID_1');
    expect(AppDispatcher.store['ID_1'].dependencies[0]).to.equal('ID_2');
  });

  it('disallows multiple listeners for one event', () => {
    expect(() => {
      connect([
        {
          name: 'FOO',
          params: [],
          function: () => {},
          dependencies: []
        },
        {
          name: 'FOO'
        }
      ])
    }).to.throw('Cannot attach multiple listeners to event "FOO"!');
  });

  it('autocompletes dependencies', () => {
    const tokens = connect([
      {
        name: 'FOO',
        params: [],
        function: () => {}
      }
    ]);

    expect(AppDispatcher.store[tokens['FOO']].dependencies.length).to.equal(0);
  });
});
