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
import autoCurry from '../../src/util/autoCurry';

describe('util::autoCurry', () => {
  it('gathers data', () => {
    expect(autoCurry()('foo', 'bar')('baz')('blah', 1, 2)()).to.deep.equal(['foo', 'bar', 'baz', 'blah', 1, 2]);
  })
});
