/* global Map */

import RuleSet from './ruleset';
import Namespace from './namespace';
import { STORE } from './rule';
import { getCache } from '../modules/utils';

// Setup private namespace for class properties
export const NAMESPACE = new Namespace();
const { get, set } = NAMESPACE.proxies();

export default class RuleBook {
  constructor( callback ) {
    set(this, 'content', new Map());

    if( 'function' === typeof callback ) {
      callback(this, STORE);
    }
  }

  get( action ) {
    return get(this, 'content').get(action);
  }

  has( action ) {
    return get(this, 'content').has(action);
  }

  add( action, rule ) {
    return this.addMany(action, [rule]);
  }

  addMany( action, rules ) {
    let content = get(this, 'content'), ruleSet;

    ruleSet = getCache(content, action, () => {
      return new RuleSet(action);
    });

    ruleSet.addMany(rules);
    return this;
  }
}
