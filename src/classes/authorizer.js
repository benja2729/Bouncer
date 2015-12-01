/* global Set, TypeError */

import RuleBook from './rulebook';
import Namespace from './namespace';
import { assert, isIterable } from '../modules';

// Setup private namespace for class properties
export const NAMESPACE = new Namespace();
const { get, set } = NAMESPACE.proxies();

export default class Authorizer {
  constructor( roles, ruleBook ) {
    assert('Must pass two arguments to Authorizer constructor', arguments.length === 2);
    assert(new TypeError('Must pass a RuleBook as second parameter'), ruleBook instanceof RuleBook);
    assert(new TypeError('Must pass an iterable object for roles'), isIterable(roles));

    if(! (roles instanceof Set) ) {
      roles = new Set(roles);
    }

    set(this, 'roles', roles);
    set(this, 'ruleBook', ruleBook);
  }

  authorize( action ) {
    let roles = get(this, 'roles');
    let ruleBook  = get(this, 'ruleBook');

    if(! ruleBook.has(action) ) {
      return true;
    }

    let ruleSet = ruleBook.get(action);
    return ruleSet.invoke(roles);
  }
}
