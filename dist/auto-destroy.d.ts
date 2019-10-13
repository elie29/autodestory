import { Observable } from 'rxjs';
export declare const autoDestroy: (instance: object, destroyMethod?: string) => <T>(source: Observable<T>) => Observable<T>;
