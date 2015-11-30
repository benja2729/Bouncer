/* global Set */

import { assert, cacheProxy, isIterable } from '../modules';
import Namespace from './namespace';
import Rule from './rule';

// Setup private namespace for class properties
export const NAMESPACE = new Namespace();
const { get, set } = NAMESPACE.proxies();

export default class RuleSet {
  constructor( action, iterable ) {
    assert('Must define a RuleSet by action', 'string' === typeof action);
    this.action = action;

    set(this, 'content', new Set());
    set(this, 'important', new Set());
    set(this, 'cache', cacheProxy());

    if( isIterable(iterable) ) {
      this.addMany(iterable);
    }
  }

  add( rule ) {
    assert('Must pass a Rule to RuleSet#add', rule instanceof Rule);

    if( rule.important ) {
      get(this, 'important').add(rule);
    }

    get(this, 'content').add(rule);
    return this;
  }

  addMany( iterable ) {
    iterable.forEach( ( rule ) => {
      this.add(rule);
    });

    return this;
  }

  invoke( roles ) {
    let cache = get(this, 'cache');

    return cache(roles, () => {
      let important = get(this, 'important');
      let content = get(this, 'content');

      // Run important rules first for failure
      for( let rule of important ) {
        if( rule.run(roles) === false ) { return false; }
      }

      // Run all content (including important) for truthiness
      // ...in definiiton order. Order should be significant, I think.
      for( let rule of content ) {
        if( rule.run(roles) === true ) { return true; }
      }

      return false;
    });
  }
}
