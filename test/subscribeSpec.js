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
import subscribe, { chain } from '../src/subscribe';

describe('subscribe', () => {
  it('contains no custom handlers', function () {
    this.expected = 2;
    expect(subscribe(null, ['ID_0', 'ID_1'])).to.deep.equal({ dependencies: ['ID_0', 'ID_1'] });
  });

  it('evaluates an autoCurry list as handler array', function () {
    this.expected = 2;
    const handler = () => {};
    expect(subscribe(chain()('foo', 'bar')(handler))).to.deep.equal({
      dependencies: [],
      function:     ['foo', 'bar', handler],
    });
  });
});
