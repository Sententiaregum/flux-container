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

import { expect } from 'chai';
import resolveCreator from '../../src/util/resolveCreator';

describe('util::resolveCreator', () => {
  it('stores a creator function', function () {
    this.expected = 1;
    const creator = () => {
      return {
        key: 'value'
      }
    };

    expect(resolveCreator(creator)).to.equal(resolveCreator(creator));
  });
});
