/*
 * This file is part of the Sententiaregum project.
 *
 * (c) Maximilian Bosch <maximilian.bosch.27@gmail.com>
 * (c) Ben Bieler <benjaminbieler2014@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BaseComponent from '../src/BaseComponent';
import BaseStore from '../src/BaseStore';
import sinon from 'sinon';
import { expect } from 'chai';

describe('BaseComponent', () => {
  it('registers and unregisters handlers on a component on its lifecycle hooks', () => {
    const spy = sinon.spy(),
        testStore = new BaseStore();

    class Component extends BaseComponent {
      constructor() {
        super({}, [
          {
            store: testStore,
            handler: spy
          }
        ]);
      }
    }

    expect(testStore._eventsCount).to.equal(0);
    const component = new Component();
    component.componentDidMount();

    expect(testStore._eventsCount).to.equal(1);
    expect(testStore._events['CHANGE']).to.equal(spy);

    component.componentWillUmount();
    expect(testStore._eventsCount).to.equal(0);
  });

  describe('error handling', () => {
    it('detects invalid stores', () => {
      class Component extends BaseComponent {
        constructor() {
          super({}, [
            {
              store: {},
              handler: () => {}
            }
          ])
        }
      }

      const component = new Component();
      expect(() => component.componentDidMount()).to.throw('In order to work properly, the store must be an instance of BaseStore!');
    });

    it('detects missing properties', () => {
      class Component extends BaseComponent {
        constructor() {
          super({}, [
            {
              store: new BaseStore()
            }
          ]);
        }
      }
      const component = new Component();
      expect(() => component.componentDidMount()).to.throw('Missing config property "handler"!');
    });

    it('detects missing properties', () => {
      class Component extends BaseComponent {
        constructor() {
          super({}, [
            {
              handler: () => {}
            }
          ]);
        }
      }
      const component = new Component();
      expect(() => component.componentDidMount()).to.throw('Missing config property "store"!');
    });
  });
});
