/* global Map, WeakMap */

/**
 * Inpired by a pattern from an example from Mozilla docs
 * https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties#From_WeakMap_to_Namespace
 */

import { getCache } from '../modules/utils';

const handlers = new Map();

handlers.set(Object, {
  set: (target, name, value) => {
    target[name] = value;
  },

  get: (target, name) => {
    return target[name];
  }
});

handlers.set(Map, {
  set: (target, name, value) => {
    target.set(name, value);
  },

  get: (target, name) => {
    return target.get(name);
  }
});

handlers.set(WeakMap, {
  set: (target, name, value) => {
    target.set(name, value);
  },

  get: (target, name) => {
    return target.get(name);
  }
});

export default class Namespace {
  static get handlers() { return handlers; }

  constructor( namespaceType ) {
    this.namespaceType = namespaceType || Object;
    this.content = new WeakMap();
  }

  internal( instance ) {
    let map = this.content,
        Type = this.namespaceType;

    return getCache(map, instance, () => {
      return new Type();
    });
  }

  proxies( handler ) {
    handler = handler || handlers.get(this.namespaceType);

    return {
      set: ( instance, name, value ) => {
        let target = this.internal(instance);
        handler.set(target, name, value);
        return instance;
      },

      get: ( instance, name ) => {
        let target = this.internal(instance);
        return handler.get(target, name);
      }
    };

  }
}
