# View

In the previous steps it has been shown how actions can be triggered and
how the store can react on dispatched changes by creating a listener on the internal
dispatcher with ``getSubscribedEvents``.

The last necessary step is a view handler which listens on store changes.

## Connector API

Although react is an awesome view library which is used in ``Sententiaregum``, a
flux implementation which implements a one-way data flow for the business logic of the application
should __NEVER__ require a dependency to a view library.
That's why the react dependency has been removed in favor of a functional connection API
which doesn't depend on any library.

This API connects certain handlers with a store:

``` javascript
connector(FooStore).useWith(this.fooHandler);
```

When a component will be unmounted (e.g. a redirect to another page), the handler can be unsubscribed:

``` javascript
connector(FooStore).unsubscribe(this.fooHandler);
```

## Usage

In order to show the proper usage, a react component will be shown that uses this API to listen on store changes:

``` javascript
import { Component } from 'react';
import { connector } from 'sententiaregum-flux-container';
import FooStore from '../stores/FooStore';

class FooComponent extends Component {
  // creates and removes the handler in react's lifecycle
  // hooks being called when the component has been mounted or
  // is scheduled for unmount
  componentDidMount() {
    connector(FooStore).useWith(this.handleFoo);
  }
  componentWillUnmount() {
    connector(FooStore).unsubscribe(this.handleFoo);
  }

  // the view handler
  // extracts the new state from the store
  // and re-renders the component using this new state.
  handleFoo() {
    const newState = FooStore.state;
    this.setState({
      foo: newState.foo,
      bar: newState.bar
    });
  }

  // ...
}
```
