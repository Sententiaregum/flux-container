# Action creators

The dispatcher is the heart of this package, but should be private.
Instead a lightweight dispatch API will be provided which calls action
from certain points in the view.

## Action

An action should be a facade for the dispatcher, but also call infrastructural services
like a REST API.
When such tasks are done, the ``dispatch`` function should send a payload to all callbacks being associated
with the alias ``SAVE_BOOK``.

``` javascript
// actions/BookActions.js
export function persistBook(formData) {
  return dispatch => { // create a action
    // do an API call or sth. like this
    dispatch(SAVE_BOOK, formData); // just like AppDispatcher.dispatch
  }
}
```

## View

This action can be invoked in the view like this:

``` javascript
// components/FooComponent.js
import { runAction } from 'sententiaregum-flux-container';
import { persistBook } from '../actions/BookActions';
import { Component } from 'react';

class FooComponent extends Component {
  onSubmit(e) {
    e.preventDefault();
    runAction(persistBook, [this.state.formData]);
  }
}
```

In a view event (e.g. the submit of a form) an action should be invoked by using the action creator and the ``runAction`` API.
