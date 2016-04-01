/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { expect } from 'chai';
import combine from '../../src/util/combine';

describe('util::combine', () => {
  it('throws error if amount of params does not match the amount of arguments', () => {
    expect(() => combine([], ['foo'])).to.throw('The length of the keys must match the length of the args!');
  });

  it('combines two arrays to an object', () => {
    const object = combine(['foo', 'bar'], ['blah', 'blub']);

    expect(Object.keys(object).length).to.equal(2);
    expect(object['foo']).to.equal('blah');
    expect(object['bar']).to.equal('blub');
  });
});
 