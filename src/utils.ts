import { Indexer } from './types';

const Primitives = [ 'string', 'number', 'boolean', 'undefined', 'bigint' ];
export const isPrimitive = (x: any) => {
  const t = typeof x;
  return Primitives.indexOf(t) >= 0;
};

// eslint-disable-next-line max-len
type MergeDeep = <L extends Indexer, R extends Indexer>(left: L, right: R) => L & R;
export const mergeDeep: MergeDeep = (left, right) => {
  const result = Object.assign({}, left, right);
  Object.keys(right).forEach((key) => {
    const l = left[key];
    const r = right[key];
    if (l != null && typeof l === 'object') {
      // @ts-ignore
      result[key] = mergeDeep(l, r);
    }
  });
  return result;
};

export const isPromise = <T>(x: T | Promise<T>): x is Promise<T> => {
  return x instanceof Promise;
};

export const reduceObj = <T, R>(
  fn: (acc: R, t: T, key: string) => R,
  initial: R,
  obj: Indexer<T>,
): R => Object
    .keys(obj)
    .reduce((acc, key) => {
      return fn(acc, obj[key], key);
    }, initial);

export const mapObj = <T, R>(
  fn: (t: T, key: string) => R,
  obj: Indexer<T>,
): Indexer<R> => {
  return reduceObj((obj, value, key) => {
    return {
      ...obj,
      [key]: fn(value, key),
    };
  }, {}, obj);
};
