# Stores

## Connect the store with the action

### Example

In order to avoid writing much boiler-plate code and having just a simple config, a ``connector``
has been implemented which connects the listeners from a store to the dispatcher:

``` javascript
import { AppDispatcher, BaseStore } from 'sententiaregum-flux-container';

class Store extends BaseStore {
  constructor() {
    super();
    this.state = {
      name: 'bar'
    };
  }

  getSubscribedEvents() {
    return [
      {
        name: 'EVENT_NAME',
        function: (param1, param2) => {
          return {
            'name': param1,
            'surname': param2
          }
        },
        params: ['param1', 'param2']
      }
    ];
  }
}

const store = new Store();
store.init();
```

The above example is quite self-explanatory:
It connects handlers to certain dispatch calls, so stores can react on dispatches.
This handler is __not__ bound to the store as it should be side-effect free and should contain pure logic.
The result of this handler is the new ``this.state`` of the store (it is recommended to keep this handler in its own module, but not in the ``getSubscribedEvents`` method.

If nothing should be done with the state from dispatch, but directly injected into the store, the ``function`` value can be omitted,
a generic handler will be used which transfers the payload directly into the store's state.

Now the store flushes the recent changes to the view:
As it extends node's internal ``EventEmitter`` it emits the event ``BaseStore.CHANGE_EVENT``.
A react view can listen to this event and receive the result from the store in that way.

The store does also contain all the tokens to make the available for other stores requiring them as dependencies.

``` javascript
const dispatchToken = store.getDispatchTokenByEventName('EVENT_NAME')
```

### Execution order

If multiple stores listen to a change, but require another one, the execution order can be declared to provide a safe way of refreshing multiple stores:

``` javascript
class Store extends BaseStore {
  getSubscribedEvents() {
    return [
      {
        name: 'EVENT_NAME',
        params: ['param1', 'param2'],
        function: (param1, param2) => {},
        dependencies: [FooStore.getDispatchTokenByEventName('EVENT_NAME')] // this handler will be executed, when FooStore
                                                                           // has is refreshed
      }
    ];
  }
}
```
