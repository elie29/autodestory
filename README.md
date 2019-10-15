# Auto Destroy

[![Build Status](https://travis-ci.org/elie29/autodestroy.svg?branch=master)](https://travis-ci.org/elie29/autodestroy)
[![Coverage Status](https://coveralls.io/repos/github/elie29/autodestroy/badge.svg?branch=master)](https://coveralls.io/github/elie29/autodestroy?branch=master)
[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.svg?v=102)](https://github.com/elie29/autodestory)

## Problem

When we use RxJS, we have to cancel all subscription objects we create. In angular, we have the possibility to use [async pipe](https://angular.io/api/common/AsyncPipe). However, in some use cases, we don't have this opportunity and we need manually to unsubscribe each subscription or complete the Observable by using takeUntil.

Although, we have to duplicate the same code over and over, the implementation of this pattern becomes repetitive for each component that uses subscriptions.

## Solution

Auto destroy library offers a single autoDestroy operator method. It overrides any existent destroy method to handle automatically subscription cancellation on any observable.

## How it works

We can use the autoDestroy operator along with angular component as follow:

```TS
export class PostComponent implements OnDestroy {
  constructor(postService: PostService) {
    postService.getPosts()
      .pipe(
        switchMap(...)
        ... other observables
        // to prevent leaks with intermediate observables, this **MUST** be the last operator !!
        autoDestroy(this)
      )
      .subscribe();
  }

  // must be implemented even empty
  ngOnDestroy(): void {}
}
```

The autoDestroy operator is RxJS specific and not related to Angular. Thus, it can be used with any Observable as follow:

```TS
export class AuthorComponent {
  constructor() {
    timer(0, 300)
      .pipe(
        map(next => next * 3),
        filter(next => next % 2 !== 0),
        autoDestroy(this, 'destroy') // default method name is ngOnDestroy
      )
      .subscribe();
  }

  private log(message: string): void {
    console.log(message);
  }

  // original destroy method would be called automatically
  destroy(message: string): void {
    this.log(message);
  }
}
```

## Peer Dependency

The auto destroy pipe depends on:

1. RxJS ^6.3

   - Observable
   - Subject
   - takeUntil

## Publish to npm repo

1. Increment version number in package.json and package-lock.json
1. Run `npm run pub` then enter the 2FA code
1. Commit, push and create a new github release
