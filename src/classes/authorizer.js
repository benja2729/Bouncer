/* global Set, TypeError */

import RuleBook from './rulebook';
import Namespace from './namespace';
import { assert, isIterable } from '../modules';

// Setup private namespace for class properties
export const NAMESPACE = new Namespace();
const { get, set } = NAMESPACE.proxies();

/**
 @class Authorizer
 @namespace Bouncer
*/
export default class Authorizer {

  /**
   @method create
   @static
   @param { Array, Set } roles
   @param { Function } callback
   @return { Authorizer }
  */
  static create( roles, callback ) {
    assert(new TypeError('Must pass a callback function'), 'function' === typeof callback);
    let ruleBook = new RuleBook(callback);

    return new this(roles, ruleBook);
  }

  /**
   @constructor
   @param { Array, Set } roles
   @param { RuleBook } ruleBook
 */
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

  /**
   @method authorize
   @param action
   @return { Boolean }
 */
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
