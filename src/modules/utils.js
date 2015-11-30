/* global Map */

export function assert( message, assertion ) {
  if(! assertion ) {
    throw message instanceof Error ? message : new Error(message);
  }
}

export function cacheProxy() {
  let cache = new Map();

  return function proxy( key, callback ) {
    if( cache.has(key) ) {
      return cache.get(key);
    }

    let value = callback(key);
    cache.set(key, value);

    return value;
  };
}

export function isIterable( iterable ) {
  if( arguments.length === 0 || iterable == null ) {
    return false;
  }

  return 'function' === typeof iterable[Symbol.iterator];
}
