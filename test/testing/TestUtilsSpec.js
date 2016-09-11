/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import TestUtils from '../../src/testing/TestUtils';
import store from '../../src/store';
import { expect } from 'chai';
import Dispatcher from '../../src/dispatcher/Dispatcher';

describe('testing::TestUtils', () => {
  afterEach(() => Dispatcher.reset());

  it('validates the payload', () => {
    const EVENT   = 'EVENT';
    const creator = publish => {
      return {
        [EVENT]: (form_data) => publish({ status: '000', data: form_data })
      };
    };

    TestUtils.executeAction(creator, EVENT, [{ foo: 'bar' }])({
      status: '000',
      data:   {
        foo: 'bar'
      }
    });
  });

  describe('integration tests', () => {
    it('asserts against the appropriate workflow', () => {
      const EVENT     = 'EVENT';
      const testStore = store({
        [EVENT]: {
          params:   ['foo'],
          function: foo => ({ status: '00', data: foo })
        }
      }, {});

      const creator = publish => ({
        [EVENT]: () => publish({ foo: { data: [] } })
      });

      TestUtils.executeFullWorkflow(creator, EVENT, [])({
        status: '00',
        data:   {
          data: []
        }
      }, testStore);
    });

    it('asserts against multiple stores', () => {
      const EVENT      = 'EVENT';
      const testStore  = store({
        [EVENT]: {
          params:   ['foo'],
          function: foo => ({ data: foo })
        }
      }, {});
      const otherStore = store({
        [EVENT]: { params: ['bar'] }
      });

      const creator = publish => ({
        [EVENT]: () => publish({ foo: { data: [] }, bar: 'data' })
      });

      TestUtils.executeFullWorkflow(creator, EVENT, [])([{ data: { data: [] } }, { bar: 'data' }], [testStore, otherStore]);
    });

    it('throws an error if expected values are not given as array', () => {
      const EVENT      = 'EVENT';
      const testStore  = store({
        [EVENT]: {
          params:   ['foo'],
          function: foo => ({ data: foo })
        }
      }, {});
      const otherStore = store({
        [EVENT]: { params: ['bar'] }
      });

      const creator = publish => ({
        [EVENT]: () => publish({ foo: { data: [] }, bar: 'data' })
      });

      expect(() => TestUtils.executeFullWorkflow(creator, EVENT, [])({ foo: { data: [] } }, [testStore, otherStore])).to.throw('A list of expected values is needed when asserting against multiple stores!');
    });
  });
});
