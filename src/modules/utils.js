
export function eachKey(hash, callback) {
  for( var key in hash ) {
    callback(key, hash[key], hash);
  }

  return hash;
}

export function invokeEvery( fnArray, args, context=null ) {
  for( let idx in fnArray ) {
    let fn = fnArray[idx];
    if(! fn.apply(context, args) ) {
      return false;
    }
  }

  return true;
}

export function invokeAny( fnArray, args, context=null ) {
  for( let idx in fnArray ) {
    let fn = fnArray[idx];
    if( fn.apply(context, args) ) {
      return true;
    }
  }

  return false;
}

export function hasIntersection( ...arrays ) {
  return true;
}
