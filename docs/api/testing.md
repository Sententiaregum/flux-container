# Testing

As the actions and stores represent the business logic, it's obligatory to test everything to ensure
good code quality and regressions avoidance.

There are certain approaches how to test:

- __Testing actions:__ in this case it could be tested whether actions build the right payload from API calls and user arguments. 
- __Testing interaction:__ in this case it could be tested whether stores build the right state when receiving data from actions.
- __Testing handlers:__ handlers might contain quite complex logic which needs its own unit tests for refactoring purposes.

## Test utils

Tests of handlers, lazy state and similar components don't need a special API to test as they simply are pure functions composed with each other.
Only the first two points listed above need such an API as they involve the actions and the dispatcher lifecycles.

### Testing pure actions

#### A simple action

A simple action might look like this:

``` javascript
// src/actions/postActions.js
import { PUBLISH_POST } from '../constants/post';

export default function postActions(publish) {
  function publishPost(postId) {
    publish({ postId });
  }

  return {
    [PUBLISH_POST]: publishPost,
  };
};
```

To keep it simple, asynchronous stuff will be omitted here (can be mocked easily with tools like `sinon` though).

A test of that might look like this:

``` javascript
// test/actions/postActionsSpec.js
import postActions from '../../src/actions/postActions';
import { TestUtils } from 'sententiaregum-flux-container';
import { PUBLISH_POST } from '../constants/post';

describe('postActions', () => {
  it('publishes post', () => {
    TestUtils.executeAction(postActions, PUBLISH_POST, ['long-id'])({ postId: 'long-id' });
  });
});
```

This test executes the action called `PUBLISH_POST` and ensures that the dispatched payload looks like `{ postId: 'long-id' }` which will be done
using a `deep-equal` comparison.
If the `deep-equal` validation fails, an `invariant violation` will be thrown.

#### Cascading actions

In the docs about [actions](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/actions.md) it has been shown how to dispatch multiple actions.
This scenario needs to be covered, too:

``` javascript
// src/actions/postActions.js
import { PUBLISH_POST, REPUBLISH_POST } from '../constants/post';
import { runAction } from 'sententiaregum-flux-container';

export default function postActions(publish) {
  function publishPost(postId) {
    publish({ postId });
  }

  return {
    [PUBLISH_POST]:   publishPost,
    [REPUBLISH_POST]: () => {
      runAction(PUBLISH_POST, postActions, ['some-id'])
      publish({ republish: 'some-id', date: new Date() });
    }
  };
};
```

This is a simple example of how it looks like when an action publishes another action.
The `REPUBLISH_POST` action can be tested like this:

``` javascript
// test/actions/postActionsSpec.js
import postActions from '../../src/actions/postActions';
import { TestUtils } from 'sententiaregum-flux-container';
import { REPUBLISH_POST, PUBLISH_POST } from '../constants/post';

describe('postActions', () => {
  it('publishes post', () => {
    TestUtils.executeAction(postActions, REPUBLISH_POST, ['long-id'])(
      { postId: 'some-id', date: new Date() },
      [PUBLISH_POST],
      {
        [PUBLISH_POST]: {
          postId: 'some-id'
        }
      }
    );
  });
});
```

In this case the function which compares the payload using the `deep-equal` takes three arguments:

The first one is the state published by the `REPUBLISH_POST`.
The second one is an array which validates which actions will be triggered, too. In this example the `PUBLISH_POST` action only.
The last parameter is an object which associates the other actions dispatched with the payload and compares the payload with a `deep-equal`, too.

### Integration testing

In the previous articles a store and an action creator to publish a store were created (see [actions](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/actions.md) and [stores](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/stores.md)).
Now it'll be shown how to test the communication between those components properly:

``` javascript
// test/integration/publishPost.js
import postActions from '../../src/actions/postActions';
import postStore from '../../src/stores/postStore';
import { TestUtils } from 'sententiaregum-flux-container';
import { PUBLISH_POST } from '../constants/post';

describe('publishPost', () => {
  it('publishes a post', () => {
    TestUtils.executeWorkflow(postActions, PUBLISH_POST, ['post-id'])({
      post: { id: 'post-id', published: true }
    }, postStore);
  });
});
```

In this example the `PUBLISH_POST` action will be triggered with the arguments defined as third parameter in the `executeWorkflow` function.
The function being returned takes as first argument the expected state and as second argument the store which should contain this state.

The store's state and the expected one will be compared using a `deep-equal` and in case of mismatches an invariant violation will be thrown.
