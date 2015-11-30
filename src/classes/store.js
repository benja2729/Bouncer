/* global Set */

import { isIterable } from '../modules';
import Namespace from './namespace';

// Setup private namespace for class properties
export const NAMESPACE = new Namespace();
const { get, set } = NAMESPACE.proxies();

export default class Store {
  constructor() {
    set(this, 'content', new Set());
    set(this, 'idCount', 0);
    set(this, 'ids', new Map());
    set(this, 'tags', new Map());
  }

  get all() {
    return get(this, 'content');
  }

  add( object ) {
    let id = idFor(this, object),
        ids = get(this, 'ids');

    if( ids.has(id) ) {
      return;
    }

    this.all.add(object);
    ids.set(id, object);

    if( isIterable(object.tags) ) {
      addTags(get(this, 'tags'), object);
    }
  }

  unload( object ) {
    if(! this.all.delete(object) ) {
      return false;
    }

    get(this, 'ids').delete(object);
    deleteTags(get(this, 'tags'), object);

    return true;
  }

  unloadAll() {
    this.all.clear();
    get(this, 'ids').clear();
    get(this, 'tags').clear();
  }

  filter( callback ) {
    let result = [];

    for( let object of this.all ) {
      if( callback(object) ) {
        result.push(object);
      }
    }

    return result;
  }

  filterBy( key, value ) {
    if( key === 'tag' ) {
      return this.filterByTag(value);
    }

    return this.filter( ( object ) => {
      object[key] === value;
    });
  }

  filterByTag( tag ) {
    let tags = get(this, 'tags'),
        result =  tags.get(tag);
    return result ? [...result] : [];
  }

  find( callback ) {
    for( let object of this.all ) {
      if( callback(object) ) {
        return object;
      }
    }
  }

  findBy( key, value ) {
    if( key === 'id' ) {
      return this.findById(value);
    }

    return this.find( ( object ) => {
      object[key] === value;
    });
  }

  findById( id ) {
    let ids = get(this, 'ids');
    return ids.get(id);
  }
}

function idFor( store, object ) {
  let idCount = get(store, 'idCount');

  if(! object.id ) {
    object.id = idCount++;
    set(store, 'idCount', idCount);
  }

  return object.id;
}

function addTags( tags, object ) {
  for( let tag of object.tags ) {
    if( tags.has(tag) ) {
      tags.get(tag).add(object);
    } else {
      tags.set(tag, new Set([object]));
    }
  }
}

function deleteTags( tags, object ) {
  for( let tag of object.tags ) {
    tags.get(tag).delete(object);
  }
}
