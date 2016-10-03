# Stores

## How should stores look like?

To reduce the amount of boilerplate code this library automates all the subscription logic and hides the dependency
to the event dispatcher. The store itself contains a state which can be changed by certain events
and after that the store flushes the state to its subscribers if the state changes.

## Public API

The store is the instance of an internal class holding the state.
The public API of this store contains three methods:

- __getState()__ - returns the internal state.
- __getStateValue(propertyPath:String, default:String=null)__ - receives a single value from the state.
- __getToken(eventName:String)__ - returns the dispatch token of a certain event name (have a look at the chapter `Execution order`).

The state can be handled like this:

``` javascript
const state = fooStore.getState();
```

The state is usually an object, so single values can be extracted like this:

``` javscript
// state looks like this:
// {
//   "foo": {
//     "bar": "baz"
//    }
// }

const value = fooStore.getStateValue('foo.bar'); // returns 'baz'
const other = fooStore.getStateValue('foo.blah', 'blah'); // returns 'blah' as the default will be returned if the property path is invalid
```

When an array is inside this state, the data can be fetched like this:

``` javascript
// state looks like this:
// {
//   "foo": [
//     { "bar": "baz" }
//   ]
// }

const value = fooStore.getStateValue('foo[0].bar'); // returns 'baz'
```

## Assemble a store and hook into the one-way data flow

### Basic usage

The store can be created like this:

``` javascript
// src/stores/postStore.js
import { store, subscribe } from 'sententiaregum-flux-container';
import publishHandler from './handlers/publishHandler';
import { PUBLISH_POST } from '../constants/post';

export default store(
  {
    [PUBLISH_POST]: subscribe(subscribe.chain()(publishHandler))
  },
  {} // initial state is an empty object by default
);
```

The code above creates a store which subscribes to the `PUBLISH_POST` defined in the [Actions documentation](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/actions.md).
The `params` array tells the dispatcher which parameters from the payload are necessary. The `publishHandler` is a pure function
which takes these payload parameters and recreates the state:

``` javascript
// src/stores/handlers/publishHandler
import postStore from '../postStore';

export default function storeHandler(postId) {
  const original = postStore.getState(); // by accessing the store directly, the current state can be fetched.

  return { post: { id: postId, published: true } }; // re-creates the state from the new payload parameters
}
```

Please keep in mind that the order of parameters in the `params` array must match the order of arguments in the store handler.

Whenever the state is refreshed, the store triggers the event emitter which tells other subscribers that the state has changed.
It's possible to subscribe the store by using the [``connector`` API](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/view.md).

In some cases the state must be equal to the payload. In this case the store definition could look like this:

``` javascript
// src/stores/postStore.js
import { store, subscribe } from 'sententiaregum-flux-container';
import publishHandler from './handlers/publishHandler';
import { PUBLISH_POST } from '../constants/post';

export default store({ [PUBLISH_POST]: subscribe() });
```

In this case the state of the store would look like this after the `PUBLISH_POST` action has been dispatched:

```
{ postId: 'post-id-value' }
```

### Updating sub-sections of a tree

When having a state tree it should be possible to modify sub-sections.

Assuming the state looks like this:

``` javascript
{
    posts: {
        data: { ... }
    },
    postsPerPage: 25
}
```

Then the state might be modified like this:

``` javascript
// src/stores/postStore.js
import { store, subscribe } from 'sententiaregum-flux-container';
import { PUBLISH_POST } from '../constants/post';

export default store({ [PUBLISH_POST]: subscribe(subscribe.chain()('posts'))
```

If the payload for `PUBLISH_POST` looks like this:

``` javascript
{
    "data": { ... }
}
```

Then it will be merged in the `posts` tree of the state.

If `posts` would be an array, the new data would be concatenated.

### Multiple handlers

Furthermore it's possible to chain many of the handlers:

``` javascript
// src/stores/postStore.js
import { store, subscribe } from 'sententiaregum-flux-container';
import publishHandler from './handlers/publishHandler';
import feedHandler from './handlers/feedHandler';
import { PUBLISH_POST } from '../constants/post';

export default store({ [PUBLISH_POST]: subscribe(subscribe.chain()(publishHandler)(feedHandler))
```

In this case the `feedHandler` would get the result evaluated right after the `publishHandler` and would get the state evaluated by the `publishHandler`
and the old state of the store.

### Execution order

If multiple stores listen to one dispatch and a store has to ensure that another store is executed before, it can be handled like this:

``` javascript
// stores/postStore.js
import { store, subscribe } from 'sententiaregum-flux-container';
import commentStore from './commentStore';
import { PUBLISH_POST } from '../constants/post';

export default store({
  [PUBLISH_POST]: subscribe(null, [CommentStore.getToken(PUBLISH_POST)])
}, {});
```

Now the state `postStore` will be refreshed __after__ the `commentStore` has been refreshed.

#### Dependency cycles

It's impossible to define cycled dependencies:

``` javascript
// stores/test.js
import { PUBLISH_POST } from '../constants/post';
import { store, subscribe } from 'sententiaregum-flux-container';

const store1 = store({
  [PUBLISH_POST]: subscribe(null, dependencies: store2.getToken(PUBLISH_POST))
});
const store2 = store({
  [PUBLISH_POST]: subscribe(null, dependencies: store1.getToken(PUBLISH_POST))
});
```

In this example the stores require each other. Such cases cause an `invariant violation`.

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
to initialize the state, when the state is accessed:

``` javascript
import initializeFooStore from './initializers/initializeFooStore';

export default store({
  // many subscriptions
}, initializeFooStore);
```

Store handlers can return functions as state, too. These functions will be evaluated once, when another component
accesses the state. When the lazy state is evaluated once, the result returned by the callback will be copied into the state and replaces the function.

## [Next (View)](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/view.md)
