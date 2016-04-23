flux-container
==============

[![Code Climate](https://codeclimate.com/github/Sententiaregum/flux-container/badges/gpa.svg)](https://github.com/Sententiaregum/flux-container)
[![Issue Count](https://codeclimate.com/github/Sententiaregum/flux-container/badges/issue_count.svg)](https://github.com/Sententiaregum/flux-container)
[![Build Status](https://travis-ci.org/Sententiaregum/flux-container.svg?branch=master)](https://travis-ci.org/Sententiaregum/flux-container)
[![NPM Version](https://badge.fury.io/js/sententiaregum-flux-container.svg)](https://www.npmjs.com/package/sententiaregum-flux-container)
[![Build status](https://ci.appveyor.com/api/projects/status/qk0rs9ytq2k6c2xb/branch/master?svg=true)](https://ci.appveyor.com/project/Ma27/flux-container/branch/master)

Flux container is a npm package containing the flux implementation of
sententiaregum using modern technologies like ES6.

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

## Docs

The docs are located in the [docs](https://github.com/Sententiaregum/flux-container/blob/master/docs) directory.

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
