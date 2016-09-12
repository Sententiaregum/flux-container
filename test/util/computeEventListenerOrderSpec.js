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
import computeEventListenerOrder from '../../src/util/computeEventListenerOrder';

describe('util::computeEventListenerOrder', () => {
  function execChain(chain) {
    chain.forEach(item => {
      item();
    });
  }

  describe('basic functionality', () => {
    it('computes order of dependencies', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy();
      const data = {
        'ID_1': {
          callback:     spy1,
          eventName:    'CHANGE',
          dependencies: ['ID_3']
        },
        'ID_2': {
          callback:     spy2,
          eventName:    'CHANGE',
          dependencies: ['ID_1']
        },
        'ID_3': {
          callback:     spy3,
          eventName:    'CHANGE',
          dependencies: []
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(3);
      execChain(result);

      expect(data['ID_1'].callback.calledBefore(data['ID_2'].callback)).to.equal(true);
      expect(data['ID_1'].callback.calledAfter(data['ID_3'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledAfter(data['ID_3'].callback)).to.equal(true);
    });

    describe('multiple dependencies', () => {
      it('resolves trees with multiple dependencies properly', () => {
        const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy();
        const data = {
          'ID_1': {
            callback:     spy1,
            eventName:    'CHANGE',
            dependencies: ['ID_2', 'ID_3']
          },
          'ID_2': {
            callback:     spy2,
            eventName:    'CHANGE',
            dependencies: []
          },
          'ID_3': {
            callback:     spy3,
            eventName:    'CHANGE',
            dependencies: []
          }
        };

        const result = computeEventListenerOrder(data);
        expect(result.length).to.equal(3);
        execChain(result);

        expect(data['ID_2'].callback.calledBefore(data['ID_1'].callback)).to.equal(true);
        expect(data['ID_3'].callback.calledBefore(data['ID_1'].callback)).to.equal(true);
        expect(data['ID_3'].callback.calledAfter(data['ID_2'].callback)).to.equal(true);
      });

      it('resolves trees with multiple steps', () => {
        const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy(), spy4 = sinon.spy();
        const data = {
          'ID_1': {
            callback:     spy1,
            eventName:    'CHANGE',
            dependencies: ['ID_3']
          },
          'ID_2': {
            callback:     spy2,
            eventName:    'CHANGE',
            dependencies: []
          },
          'ID_3': {
            callback:     spy3,
            eventName:    'CHANGE',
            dependencies: ['ID_2', 'ID_4']
          },
          'ID_4': {
            callback:     spy4,
            eventName:    'CHANGE',
            dependencies: []
          }
        };

        const result = computeEventListenerOrder(data);
        expect(result.length).to.equal(4);
        execChain(result);

        expect(data['ID_2'].callback.calledBefore(data['ID_4'].callback)).to.equal(true);
        expect(data['ID_4'].callback.calledBefore(data['ID_3'].callback)).to.equal(true);
        expect(data['ID_3'].callback.calledBefore(data['ID_1'].callback)).to.equal(true);
      });
    });

    it('computes tree with shared dependencies', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy(), spy4 = sinon.spy(), spy5 = sinon.spy();
      const data = {
        'ID_1': {
          callback:     spy1,
          eventName:    'CHANGE',
          dependencies: ['ID_5']
        },
        'ID_2': {
          callback:     spy2,
          eventName:    'CHANGE',
          dependencies: ['ID_3']
        },
        'ID_3': {
          callback:     spy3,
          eventName:    'CHANGE',
          dependencies: []
        },
        'ID_4': {
          callback:     spy4,
          eventName:    'CHANGE',
          dependencies: ['ID_3']
        },
        'ID_5': {
          callback:     spy5,
          eventName:    'CHANGE',
          dependencies: ['ID_2', 'ID_4']
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(5);
      execChain(result);

      expect(data['ID_3'].callback.calledBefore(data['ID_2'].callback)).to.equal(true);
      expect(data['ID_3'].callback.calledBefore(data['ID_4'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledBefore(data['ID_4'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledBefore(data['ID_5'].callback)).to.equal(true);
      expect(data['ID_4'].callback.calledBefore(data['ID_5'].callback)).to.equal(true);
      expect(data['ID_5'].callback.calledBefore(data['ID_1'].callback)).to.equal(true);
    });
  });

  describe('multiple edges', () => {
    it('computes order for multiple base IDs', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy(), spy4 = sinon.spy();
      const data = {
        'ID_1': {
          callback:     spy1,
          eventName:    'CHANGE',
          dependencies: ['ID_3']
        },
        'ID_2': {
          callback:     spy2,
          eventName:    'CHANGE',
          dependencies: ['ID_4']
        },
        'ID_3': {
          callback:     spy3,
          eventName:    'CHANGE',
          dependencies: []
        },
        'ID_4': {
          callback:     spy4,
          eventName:    'CHANGE',
          dependencies: []
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(4);
      execChain(result);

      expect(data['ID_1'].callback.calledAfter(data['ID_3'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledAfter(data['ID_4'].callback)).to.equal(true);

      // actual order should be kept in case of no explicitly declared dependencies
      expect(data['ID_1'].callback.calledBefore(data['ID_2'].callback)).to.equal(true);
      expect(data['ID_3'].callback.calledBefore(data['ID_2'].callback)).to.equal(true);
    });

    it('computes order with multiple bases and shared nodes', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy();
      const data = {
        'ID_1': {
          callback:     spy1,
          eventName:    'CHANGE',
          dependencies: ['ID_2']
        },
        'ID_2': {
          callback:     spy2,
          eventName:    'CHANGE',
          dependencies: []
        },
        'ID_3': {
          callback:     spy3,
          eventName:    'CHANGE',
          dependencies: ['ID_2']
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(3);
      execChain(result);

      expect(data['ID_1'].callback.calledAfter(data['ID_2'].callback)).to.equal(true);
      expect(data['ID_3'].callback.calledAfter(data['ID_2'].callback)).to.equal(true);
      expect(data['ID_3'].callback.calledAfter(data['ID_1'].callback)).to.equal(true);
    });

    it('computes order with multiple bases, a recursive tree with multiple steps and shared nodes', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy(), spy4 = sinon.spy(), spy5 = sinon.spy();
      const data = {
        'ID_1': {
          callback:     spy1,
          eventName:    'CHANGE',
          dependencies: ['ID_3']
        },
        'ID_2': {
          callback:     spy2,
          eventName:    'CHANGE',
          dependencies: ['ID_3']
        },
        'ID_3': {
          callback:     spy3,
          eventName:    'CHANGE',
          dependencies: ['ID_5']
        },
        'ID_4': {
          callback:     spy4,
          eventName:    'CHANGE',
          dependencies: []
        },
        'ID_5': {
          callback:     spy5,
          eventName:    'CHANGE',
          dependencies: ['ID_4']
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(5);
      execChain(result);

      expect(data['ID_4'].callback.calledBefore(data['ID_5'].callback)).to.equal(true);
      expect(data['ID_5'].callback.calledBefore(data['ID_3'].callback)).to.equal(true);
      expect(data['ID_1'].callback.calledAfter(data['ID_3'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledAfter(data['ID_3'].callback)).to.equal(true);

      expect(data['ID_1'].callback.calledBefore(data['ID_2'])).to.equal(true);
    });

    it('handles multiple edges alongside a recursive tree', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy();
      const data = {
        'ID_1': {
          eventName:    'CHANGE',
          callback:     spy1,
          dependencies: ['ID_2', 'ID_3']
        },
        'ID_2': {
          eventName:    'CHANGE',
          callback:     spy2,
          dependencies: ['ID_3']
        },
        'ID_3': {
          eventName:    'CHANGE',
          callback:     spy3,
          dependencies: []
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(3);
      execChain(result);

      expect(data['ID_3'].callback.calledBefore(data['ID_2'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledBefore(data['ID_1'].callback)).to.equal(true);
    });
  });

  describe('error handling', () => {
    it('throws error in case of invalid dependencies', () => {
      const data = {
        'ID_1': {
          dependencies: ['ID_0']
        }
      };

      expect(() => computeEventListenerOrder(data)).to.throw('Token "ID_0" is not registered as listener!');
    });

    it('contains no root dependency', () => {
      const data = {
        'ID_1': {
          dependencies: ['ID_2']
        },
        'ID_2': {
          dependencies: ['ID_1']
        }
      };

      const expected = 'No root dependency detected!';
      expect(() => computeEventListenerOrder(data)).to.throw(expected);
    });

    describe('circular references', () => {
      it('detects circular references', () => {
        const data = {
          'ID_1': {
            dependencies: ['ID_2']
          },
          'ID_2': {
            dependencies: ['ID_3']
          },
          'ID_3': {
            dependencies: ['ID_2']
          }
        };

        expect(() => computeEventListenerOrder(data)).to.throw(
          'Circular reference detected: Token "ID_2" is already processed!'
        )
      });

      it('detects circular references with shared dependencies', () => {
        const data = {
          'ID_1': {
            dependencies: ['ID_2']
          },
          'ID_2': {
            dependencies: ['ID_3']
          },
          'ID_3': {
            dependencies: ['ID_4']
          },
          'ID_4': {
            dependencies: ['ID_3']
          },
          'ID_5': {
            dependencies: ['ID_4']
          }
        };

        expect(() => computeEventListenerOrder(data)).to.throw(
          'Circular reference detected: Token "ID_3" is already processed!'
        );
      });

      it('detects circular references with multiple dependencies', () => {
        const data = {
          'ID_1': {
            dependencies: ['ID_2', 'ID_3']
          },
          'ID_2': {
            dependencies: ['ID_3']
          },
          'ID_3': {
            dependencies: ['ID_2']
          }
        };

        expect(() => computeEventListenerOrder(data)).to.throw(
          'Circular reference detected: Token "ID_2" is already processed!'
        );
      });

      it('detects circular references with multiple steps', () => {
        const data = {
          'ID_1': {
            dependencies: ['ID_3']
          },
          'ID_2': {
            dependencies: ['ID_4']
          },
          'ID_3': {
            dependencies: ['ID_2']
          },
          'ID_4': {
            dependencies: ['ID_2']
          }
        };

        expect(() => computeEventListenerOrder(data)).to.throw(
          'Circular reference detected: Token "ID_2" is already processed!'
        );
      });
    });

    it('fixes malformed dependencies automatically', () => {
      const spy1 = sinon.spy(), spy2 = sinon.spy();
      const data = {
        'ID_1': {
          callback:     spy1,
          dependencies: ['ID_2', 'ID_2']
        },
        'ID_2': {
          callback:     spy2,
          dependencies: []
        }
      };

      const result = computeEventListenerOrder(data);
      expect(result.length).to.equal(2);
      execChain(result);

      expect(data['ID_2'].callback.calledBefore(data['ID_1'].callback)).to.equal(true);
      expect(data['ID_2'].callback.calledOnce).to.equal(true);
    });
  });
});
