import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const autoDestroySymbol = Symbol('autoDestroy');

export const autoDestroy = (
  instance: object,
  destroyMethod = 'ngOnDestroy'
) => {
  createSubject(instance, destroyMethod);
  return <T>(source: Observable<T>) =>
    source.pipe(takeUntil<T>(instance[autoDestroySymbol]));
};

const createSubject = (instance: object, destroyMethod: string): void => {
  assertDestroyExists(instance, destroyMethod);
  // should not be called twice
  if (!instance[autoDestroySymbol]) {
    createSubjectOnce(instance, destroyMethod);
  }
};

const assertDestroyExists = (instance: object, destroyMethod: string): void => {
  if (typeof instance[destroyMethod] !== 'function') {
    throw new Error(
      `${instance.constructor.name} doesn't implement ${destroyMethod}`
    );
  }
};

const createSubjectOnce = (instance, destroyMethod): void => {
  const current = instance[destroyMethod];

  instance[autoDestroySymbol] = new Subject<void>();

  // tslint:disable-next-line: only-arrow-functions
  instance[destroyMethod] = function() {
    current.apply(instance, arguments);
    instance[autoDestroySymbol].next();
    instance[autoDestroySymbol].complete();
  };
};
