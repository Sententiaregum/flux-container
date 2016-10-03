# Action creators

## Introduction

Whenever data needs to be changed due to a user interaction in the view for instance, an action will be triggered which
contains this data. Actions itself are a set of data which is published in the system.
As such actions usually communicate with an external API such as a REST API or the localStorage for instance, therefore some helper methods called `creator` are necessary to run this logic
before publishing the action.

## Building a simple action creator

An action creator can define one or multiple actions with a name and associate them with a callback.
These names should be defined in its own module:

``` javascript
// src/constants/post.js
const PUBLISH_POST = 'PUBLISH_POST';
const CREATE_POST  = 'CREATE_POST';

export {
  PUBLISH_POST,
  CREATE_POST
};
```

Now an action creator can be created which defines actions for each of these event names:

``` javascript
// src/actions/postActions.js
import { PUBLISH_POST, CREATE_POST } from '../constants/post';

export default function postActions() {
  function publishPost(publish, postId) {
    ajax.post('/api/publish-post', { postId })
      .then(r => publish(Object.assign({}, r, { postId });
  }

  function createPost(publish, content) {
    ajax.post('/api/create-post', { content })
      .then(r => publish(r));
  }

  return {
    [PUBLISH_POST]: publishPost,
    [CREATE_POST]:  createPost
  };
};
```

As you can see, the creator returns an object which associates an event name with a function which contains the logic of the action.
In this example both actions fire an AJAX request to the server and call a function named `publish` when the response was successful.

The function `publish` takes as argument the payload which should be published into the system.
The event name is equal to the action name (e.g. `PUBLISH_POST` or `CREATE_POST`) and will be added automatically by the action creator internally.

## Executing the action

To run one of these actions a simple API has been created:

``` javascript
// src/app.js
import { runAction } from 'sententiaregum-flux-container';
import postActions from './actions/postActions';
import { CREATE_POST } from './constants/post';

runAction(CREATE_POST, postActions, [content]);
```

This function takes three arguments:

- `eventName`: the name of the action to publish.
- `actionCreator`: the action creator itself.
- `args`: An array of arguments that will be given to the action (in the example above you've seen that actions itself can take arguments, too).

## Executing multiple actions in one action

In some cases it might be necessary to execute another action after the current one is dispatched.
This can be done using the `runAction` recursively:

``` javascript
// src/actions/userActions.js
import { runAction } from 'sententiaregum-flux-container';
import { USER_CREATE, USER_INVALID_DATA } from '../constants/user';

export default function userActions() {
  function createUser(publish, formData) {
    ajax.post('/api/create-user', formData)
      .then(r => publish(r))
      .catch(r => runAction(USER_INVALID_DATA, userActions, r);
  }

  function handleUserError(publish, error) {
    publish(error);
  }

  return { USER_CREATE: createUser, USER_INVALID_DATA: handleUserError };
};
```

In this case an error will be caught and published in another action. As the `publish` function dispatches payload for the event associated with
the callback, the `runAction` API itself needs to be used to publish other actions from the current action.

## [Next (Stores)](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/stores.md)
