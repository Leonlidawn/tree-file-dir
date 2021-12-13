import { Observable } from 'rxjs';
import { takeUntil, map, distinctUntilChanged } from 'rxjs/operators';

function objectFiltered(from: any, filterKeys: string[]): any {
  const ret = Object.keys(from)
    .filter(key => filterKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = from[key];
      return obj;
    }, {});
  return ret;
}

export function safeObserve<T>(observable: Observable<T>, subscribeUntil: Observable<any>, filterKeys: string[] = null): Observable<T> {
  return observable.pipe(
    takeUntil(subscribeUntil),
    map(data => {
      if (filterKeys == null) {
        return data;
      }
      return objectFiltered(data, filterKeys);
    }),
    distinctUntilChanged((pre,cur)=>JSON.stringify(pre) == JSON.stringify(cur))
  );
}