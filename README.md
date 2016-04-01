flux-container
==============

[![Build Status](https://travis-ci.org/Sententiaregum/flux-container.svg?branch=master)](https://travis-ci.org/Sententiaregum/flux-container)

Flux container is a npm package containing the flux implementation of
sententiaregum.

## Install

You can install this package by typing:

``` shell
npm install sententiaregum-flux-container --save
```

The package requires at least ``Node 5.0`` and ``NPM 3`` is recommended.

## Manual Setup

Compile the package from ES6 to ES 5.1:

``` shell
npm run build
```

Running ESLint specs:

``` shell
npm run lint
```

Running tests

``` shell
npm test
```

## Contributing

Further information about contributing can be found in the [CONTRIBUTING.md](https://github.com/Sententiaregum/flux-container/blob/master/.github/CONTRIBUTING.md)

## Architecture

The following three sections provide an overview about the architecture of this package.

### The dispatcher

The dispatcher used by ``flux`` is lacking a proper event dispatching implementation which
causes several issues in certain use-cases:

##### Circular dispatches

Imagine the following use-case: one actions triggers a store and the resulting changes
affect the navigation (e.g. hash URL will change which causes re-rendering processes of the page).
Now during the re-rendering new dispatches (e.g. re-computing menu items due to new user rights)
will be sent which would cause endless loops as the dispatcher calls every registered callback and
therefore this implementation aborts the process with an invariant violation if this case
occurs.

The new dispatcher in this package containing an implementation being similar to the ``event emitter`` of nodejs
or the ``EventDispatcher`` package of Symfony doesn't have this problem since
not __every__ callback will be executed, but only the ones being addressed to the given event name.

But what if someone does circular dispatches with the same event names?

Yes, in that case this programmer would run into an endless loop, but there's one difference to
the flux package:
The flux package package provides __NO__ way to do that and therefore it blocks any attempt to do that.
This package provides an approach to solve this issue, but if this will be abused,
it can't be blocked by the dispatcher properly.
Further validation logic is not a good idea as you can never be sure whether
it is a circular call or just a parallel one which is called after the first one occurred.
In the next section is explained why such actions are important and due to those
there's no implementation of stricter validation logic to avoid circular loops.

##### Parallel dispatches

Another side-effect are multiple dispatches at the same time:
Imagine someone would hit multiple buttons and everyone would cause more and more dispatches.

That can't be tackled by the ``flux`` dispatcher since it stores required data like the payload
are stored inside the dispatcher and due to the fact that it is a singleton,
this information would be overridden in case of multiple dispatches.

The idea of creating multiple dispatchers may help with different actions, but there are use-cases where it
won't fit the requirements:
Imagine a timeline with multiple posts and multiple like buttons.
What if someone hits multiple buttons and the dispatcher would have to wait until the action before has been processed.
In that case you would have to create a dispatcher for any post and
that wouldn't be the best solution.

As this dispatcher stores the subscribing callbacks only, but no dispatch-related
state, multiple actions can be processed without affecting the internal state.

### The ``service objects``

One time-waster of flux is the requirement of much boiler-plate code like
thousands of ifs to detect the proper action type.

The services are meant to automate a lot of processes and simplify configuration.

### The utils

The utils are simply a set of useful modules that are used internally.
Those modules are __not__ meant for any else usage and if someone hits bugs
that are not related to the actual in this flux implementation use-case, these bugs won't be fixed.

## Usage

In the following sections the proper usage of this package will be explained.

### Dispatcher

The dispatcher listens to certain events and calls the callback attached to this event:

``` javascript
import { AppDispatcher } from 'sententiaregum-flux-container';

Dispatcher.addListener('event', callback, []);
Dispatcher.dispatch('event', payload);
```

This attaches the callback to the event ``event``. After this the event will be dispatched with the
given payload.
The payload will be the only argument of the callback to be called.

The dispatcher can also handle dependencies:

``` javascript
const token = Dispatcher.addListener('event', callback, []);
Dispatcher.addListener('event', callback2, []);
Dispatcher.addListener('event', callback3, [token]);

Dispatcher.dispatch('event', payload);
```

The order will now look like this:

``` code
callback2 -> callback -> callback3
```

The first callback will wait until ``callback3`` is scheduled and will be executed __before__ that.

If a dispatcher is not needed anymore, it can be removed easily:
``` javascript
const token = Dispatcher.addListener('event', callback, []);
// ...

// remove the listener
Dispatcher.removeListener(token);
```

### Dispatch connector

In order to avoid writing much boiler-plate code and having just a simple config, a ``connector``
has been implemented which connects the listeners from a store to the dispatcher:

``` javascript
import { AppDispatcher, BaseStore } from 'sententiaregum-flux-container';

class Store extends BaseStore {
  constructor() {
    super();
    this.state = {
      name: 'bar'
    };
  }

  getSubscribedEvents() {
    return [
      {
        name: 'EVENT_NAME',
        function: (param1, param2) => {
          return {
            'name': param1,
            'surname': param2
          }
        },
        params: ['param1', 'param2'],
        dependencies: ['Further tokens']
      }
    ];
  }
}

const store = new Store();
store.init();
```

The above example is quite self-explanatory:
It registers handlers to certain dispatch calls and registers a handler on it.
This handler is __not__ bound to the store as it should be side-effect free and should contain pure logic.
The result of this handler is the new ``this.state`` of the store.

Now the store flushes the recent changes to the view:
As it extends node's internal ``EventEmitter`` it emits the event ``BaseStore.CHANGE_EVENT``, which is ``CHANGE``.
A react view can listen to this event and receive the result from the store in that way.

The store does also contain all the tokens to make the available for other stores requiring them as dependencies.

``` javascript
const dispatchToken = store.getDispatchTokenByEventName('EVENT_NAME')
```

## License

The MIT License (MIT)

Copyright (c) 2016 The Sententiaregum Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
