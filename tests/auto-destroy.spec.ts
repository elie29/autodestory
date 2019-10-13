import { interval, Subject } from 'rxjs';

import { autoDestroy } from '../src';

describe('autoDestroy tests', () => {
  it('should throw exception if component does not have a destroy method', () => {
    class WithoutDestroyComponent {
      interval$ = interval(20);

      constructor() {
        this.interval$.pipe(autoDestroy(this)).subscribe();
      }
    }

    expect(() => new WithoutDestroyComponent()).toThrow();
  });

  it('should override destroy method and destroy observable', () => {
    class WithDestroyComponent {
      interval$ = interval(20);

      constructor() {
        this.interval$
          .pipe(autoDestroy(this, 'destroy'))
          .subscribe(next => console.log(next));
      }

      destroy(message: string): void {
        this.log(message);
      }

      private log(message: string): void {
        console.log(message);
      }
    }

    const spy = spyOn(console, 'log');
    const instance = new WithDestroyComponent();
    instance.destroy('my message');

    expect(spy).toHaveBeenCalled;
  });

  it('should override destroy and complete all observables', () => {
    class WithDestroyComponent {
      interval$ = interval(20);
      subject$ = new Subject<void>();

      constructor(spy: any) {
        this.interval$
          .pipe(autoDestroy(this, 'destroy'))
          .subscribe(next => console.log(next));

        this.subject$.pipe(autoDestroy(this, 'destroy')).subscribe(spy);
      }

      destroy(): void {}
    }

    const spy1 = spyOn(console, 'log');
    const spy2 = {
      complete: () => jasmine.createSpy()
    };
    const instance = new WithDestroyComponent(spy2);

    instance['destroy']();

    expect(spy1).toHaveBeenCalled;
    expect(spy2.complete).toHaveBeenCalled;
  });
});
