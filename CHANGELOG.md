# Changelog

## 2.1.0

- [feature] [#34] added `subscribe()` as a shortcut with `auto-curry` to simplify store configuration (see the new [store docs](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/stores.md))
- [breaking] [#34] removed `params` and validation, use the ES6 object syntax instead:

__BEFORE:__

``` javascript
export default (foo, bar) => {};
```

__AFTER:__

``` javascript
export default ({ foo, bar }) => {};
```

- [feature] [#34] provide a last parameter to a store handler which is the old state.
- [feature] [#34] allow to pass strings as handlers for sub-section updates.

## 2.0.1

- [bug] [#33] fixed property path evaluation to allow bracket syntax for arrays
- [minor] fixed appveyor
