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
connector(postStore).unsubscribe(this.postWasPublishedHandler);
```

## Use `flux-container` with react

Rather than creating dozens of lifecycle hooks with such `connector` expressions and tons of duplicated code,
the package [`sententiaregum-flux-react`](https://github.com/Sententiaregum/sententiaregum-flux-react) is recommended to be used.

It supports event stateless components.

## [Next (Testing)](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/testing.md)
