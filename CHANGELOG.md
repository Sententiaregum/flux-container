# Changelog

__NOTE:__ please refer to the docs for new features.

## 2.1.1

- [minor] dropped support for deep equal check (many interactions need ALWAYS a refresh, so this check was useless and lead to dirty hacks)
- [bug] old state should be always refreshed

## 2.1.0

- [feature] [#34] added `subscribe()` as a shortcut with `auto-curry` to simplify store configuration (see the new [store docs](https://github.com/Sententiaregum/flux-container/blob/master/docs/api/stores.md))
- [breaking] [#34] removed `params` and validation, use the ES6 object syntax instead:

__BEFORE:__

``` javascript
// src/stores/handlers/anyHandler.js
export default (foo, bar) => {};
```

__AFTER:__

``` javascript
// src/stores/handlers/anyHandler.js
export default ({ foo, bar }) => {};
```

- [feature] [#34] provide a last parameter to a store handler which is the old state.
- [feature] [#34] allow to pass strings as handlers for sub-section updates.
- [improvement] [#35] added `mocha-performance` to measure the performance of single functions.

__BEFORE:__

``` javascript
// src/actions/anyAction.js
export default publish => {
  function firstAction(...args) {
    publish(args);
  }
  function secondAction(...args) {
    publish(args);
  }

  return {
    [FIRST]: firstAction,
    [SECOND]: secondAction
  };
};
```

__AFTER:__

``` javascript
// src/actions/anyAction.js
export default () => {
  function firstAction(publish, ...args) {
    publish(args);
  }
  function secondAction(publish, ...args) {
    publish(args);
  }

  return {
    [FIRST]: firstAction,
    [SECOND]: secondAction
  };
};
```

## 2.0.1

- [bug] [#33] fixed property path evaluation to allow bracket syntax for arrays
- [minor] fixed appveyor
