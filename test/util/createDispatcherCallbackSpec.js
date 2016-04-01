/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import sinon from 'sinon';
import { expect } from 'chai';
import createDispatcherCallback from '../../src/util/createDispatcherCallback';

describe('util::createDispatcherCallback', () => {
  it('creates proper callback', () => {
    const spy = sinon.spy();
    const callback = createDispatcherCallback(
      {
        name: 'FOO',
        function: spy,
        params: ['name']
      }
    );

    callback({
      name: 'FOO'
    });

    expect(spy.calledWith('FOO')).to.equal(true);
  });

  describe('error handling', () => {
    it('detects incomplete configuration', () => {
      expect(() => {
        createDispatcherCallback({}, {});
      }).to.throw('Required property "name" missing in event config!');
    });

    it('detects incomplete payload', () => {
      expect(() => {
        const handler = createDispatcherCallback({ name: 'EVENT', function: () => {}, params: ['foo'] });
        handler({});
      }).to.throw('Required payload parameter "foo" is missing!');
    });
  });
});
