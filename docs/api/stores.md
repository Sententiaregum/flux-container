# Stores

## How should stores look like?

A lot of flux examples declare stores as "thing" which inherits from an ``event emitter`` (usually the internal one of NodeJs)
and contains data received from the dispatcher, but stores should be dumb data stores and must not be responsible
for handling any kind of events in order to trigger changes in the view.
Therefore an improved concept of stores has been implemented to achieve this.

## Assemble a store and hook into the one-way data flow

The store is the instance of an internal class holding the state and created by a factory.
The public API of this store contains two methods:

- __getState()__ - returns the state received and processed by the dispatcher
- __getToken(eventName:String)__ - returns the dispatch token of a certain event name

The store can be created like this:

``` javascript
import { store } from 'sententiaregum-flux-container';
import storeHandler from './handlers/storeHandler';

export default store(
  {
    'EVENT_NAME': {
      function: storeHandler,
      params: ['payload_param_1', 'payload_param_2']
    }
  },
  {} // initial state (default value)
);
```

The store creates an instance of the store by using the factory function.
It is able to setup subscriptions to a dispatcher. That means: if the dispatcher runs an action
called ``EVENT_NAME``, the callback ``storeHandler`` will be executed with and parts of the payload
will be injected into this function:

``` javascript
return dispatch => {
  dispatch('EVENT_NAME', { payload_param_1: 'foo', payload_param_2: 'bar' });
}
```

The handler receives those parameters and transforms them into a state:

``` javascript
export default function storeHandler(payload_param_1, payload_param_2) {
  // to sth. fancy
  return newState;
}
```

__NOTE:__ the parameters don't have to match the aliases in the payload, but the order should be equal to the order in the ``params`` argument of the store configuration.

When the store receives the refreshed state, it triggers an action using the event emitter which is separated from the store.
A component can subscribe to it using the [``connector`` API](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/view.md).

Although the concept of using those payload handlers helps to run business logic without side-effects (a store must be dumb and a handler could cause state changes manually),
there are components which don't need this feature. In this case the ``function`` argument in the config can be omitted.
Then the payload will be injected directly into the state.

In the example above the state of the store would look like this (equal to the payload from the dispatcher):

``` javascript
{ payload_param_1: 'foo', payload_param_2: 'bar' }
```

### Execution order

If multiple stores listen to one dispatch and a store has to ensure that another store is executed before, it can be handled like this:

``` javascript
// stores/BarStore.js
import FooStore from './FooStore';

export default store({
  'EVENT_NAME': {
    dependencies: [FooStore.getToken('EVENT_NAME')]
  }
}, {});
```

Please note that stores requiring each other will cause an ``invariant violation``.

### Lazy store initialization

The initial state of a store is usually represented by the second argument of the ``store`` function.
If the computation of the initial state is a bit more complex (e.g. fetching data from a ``localStorage``) it is possible
to use a custom handler for this:

``` javascript
export default function initializeFooStore() {
  // do some magic
  return initialState;
}
```

This function is the second argument instead of the initial state and the function will be used
to initialize the state:

``` javascript
import initializeFooStore from './initializers/initializeFooStore';

export default store({
  // many subscriptions
}, initializeFooStore);
```
