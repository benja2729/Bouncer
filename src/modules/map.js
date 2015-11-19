
export const UNDEFINED = Object.create({});

export class Map {
  constructor() {
    this.clear();
  }

  get cache() {
    return this._cache;
  }
  set cache(cache) {
    throw new Error("Cannot set the private property 'cache'");
  }

  clear() {
    this._cache = {};
    return this;
  }

  register( key ) {
    if( this.isRegistered(key) ) {
      return this;
    }

    this.release(key);
    return this;
  }

  isRegistered( key ) {
    return this.cache.hasOwnProperty(key);
  }

  unregister( key ) {
    delete this.cache[key];
    return this;
  }

  release( key ) {
    this.set(key, UNDEFINED);
    return this;
  }

  isReleased( key ) {
    return this.get(key) === UNDEFINED;
  }

  has( key ) {
    return this.isRegistered(key) && !this.isReleased(key);
  }

  get( key ) {
    return this.cache[key];
  }

  set( key, value ) {
    this.cache[key] = value;
    return this;
  }

  merge( hash ) {
    Object.assign(this.cache, hash);
    return this;
  }
}
