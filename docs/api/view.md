# View

In the [previous page about stores](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/stores.md) it has been talked about
how to subscribe store changes. In order to achieve that a lightweight API called `connector` has been built.

## Connector API

An isomorphic flux implementation should never declare a dependency to a view library. Therefore a simple bridge called `connector` is able to
connect a store with a handler which might refresh a view for instance:

``` javascript
connector(postStore).subscribe(this.postWasPublishedHandler);
```

If the subscription is no longer needed, it can simply be dropped:

``` javascript
connector(FooStore).unsubscribe(this.fooHandler);
```

## [Next (Testing)](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/testing.md)
