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

import parseArrayBrackets from '../../src/util/parseArrayBrackets';
import { expect } from 'chai';

describe('util::parseArrayBrackets', function () {
  it('fixes brackets at the beginning and the end', function () {
    this.expected = 1;
    expect(parseArrayBrackets('[0]')).to.equal('0');
  });

  it('parses brackets in between', function () {
    this.expected = 1;
    expect(parseArrayBrackets('foo[0][1]')).to.equal('foo.0.1');
  });

  it('parses brackets mixed with dot notation', function () {
    this.expected = 1;
    expect(parseArrayBrackets('foo[0].bar')).to.equal('foo.0.bar');
  });
});
