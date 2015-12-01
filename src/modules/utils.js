/* global Map */

export function assert( message, assertion ) {
  if(! assertion ) {
    throw message instanceof Error ? message : new Error(message);
  }
}

export function getCache( map, key, callback ) {
  if( map.has(key) ) {
    return map.get(key);
  }

  let value = callback(key);
  map.set(key, value);

  return value;
};

export function isIterable( iterable ) {
  if( arguments.length === 0 || iterable == null ) {
    return false;
  }

  return 'function' === typeof iterable[Symbol.iterator];
}
