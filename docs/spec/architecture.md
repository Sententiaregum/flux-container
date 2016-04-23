# Architecture

This document gives basic information about the idea and concept behind the ``flux-container``
and the reasons why this has been created.

## The dispatcher

The dispatcher used by ``flux`` is lacking a proper event dispatching implementation which
causes several issues in certain use-cases:

#### Circular dispatches

Imagine the following use-case: one actions triggers a store and the resulting changes
affect the navigation (e.g. hash URL will change which causes re-rendering processes of the page).
Due to the re-rendering new dispatches (e.g. re-computing menu items due to new user rights)
will be scheduled causing endless loops since the facebook dispatcher calls every registered callback and
therefore this implementation aborts the process with an invariant violation to avoid exactly such risky iterations.

The new dispatcher in this package contains an implementation being similar to node's internal ``EventEmitter`` API which doesn't have that problem since
callbacks are associated with aliases and only callbacks having the given alias will be scheduled.

#### Parallel dispatches

Another side-effect are multiple dispatches at the same time:
What if multiple asynchronus actions must be delivered at the same time?

That can't be tackled by the ``flux`` dispatcher since it stores required data like the payload
inside the dispatcher and due to the fact that it is a singleton,
this information would be overridden in case of multiple dispatches.

The idea of creating multiple dispatchers may help with different actions, but there are use-cases where it
won't fit the requirements:
Imagine a timeline with multiple posts and a like/share button for each post.
What if someone hits multiple buttons and the dispatcher would have to wait until the action before has been processed.
In that case parallel dispatches are obligatory as otherwise heavy data traffic would
arise which slows down the application extremly.

Since this dispatcher associates callbacks to certain aliases and is stateless internally,
parallel dispatches can be implemented easily.

## The store

A store should be a dumb data object.
Therefore the state receiver should be a stateless function which runs certain operations before storing
the new state coming from the dispatcher in the store. A store shouldn't be too complex - it should
store everything in a ``state`` object internally and provide facades to the relevant data from this store in other layers.

## The ``service objects``

One time-waster of flux is the unnecessary boiler-plate code such as
thousands of ifs to detect the proper action type.

The services are meant to automate a lot of processes and simplify configuration.
Tasks of additional services might be:

- automated store <> dispatcher connection
- simplified store <> view data flush
- factory to tackle flux actions simpler

## The utils

The utils are simply a set of helpers that are used internally.
Those modules are __not__ meant for any else usage and if someone hits bugs
inside those modules that are not related to the actual implementation these will be declared as ``Won't fix``.

In order to avoid using private APIs, the applications using ``flux-container`` should only use the API exported in the index file of the module.
