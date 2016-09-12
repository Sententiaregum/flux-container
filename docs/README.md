Documentation
=============

## Learning `flux-container`

There's a short overview about how to use this package.

> __Prerequisite:__ before starting here, you should know how to use the [`flux architecture`](http://blog.andrewray.me/flux-for-stupid-people/).

- [Action creators](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/actions.md)
- [Stores](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/stores.md)
- [View Handler](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/view.md)
- [Testing](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/testing.md)

## BC

As the current `v2.x` aimed to stabilize and improve the whole implementation, `flux-container` is now stable enough to be fully semver compliant.

Please keep in mind that semver doesn't count for internal APIs:
everything tagged with the `@private` annotation is part of the private API and is highly customized for `flux-container`, so it's likely
that some of these internal parts might change in minor releases.
All these modules are located in `src/util` and the Dispatcher is also part of this private API.
