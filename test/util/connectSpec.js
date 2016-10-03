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
import Dispatcher from '../../src/dispatcher/Dispatcher';

describe('util::connect', () => {
  beforeEach(() => {
    Dispatcher.reset();
  });

  it('connects store listeners to the dispatcher', function () {
    this.expected = 3;

    const callback = () => {};
    const tokens   = connect({
      FOO: {
        function: callback,
        dependencies: ['ID_2']
      }
    });

    expect(tokens['FOO']).to.equal('ID_1');
    expect(Dispatcher.store['ID_1'].dependencies[0]).to.equal('ID_2');
  });

  it('autocompletes dependencies', function () {
    this.expected = 2;

    const tokens = connect({
      FOO: {
        function: () => {}
      }
    });

    expect(Dispatcher.store[tokens['FOO']].dependencies.length).to.equal(0);
  });
});
