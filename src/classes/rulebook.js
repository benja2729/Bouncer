/* global Map */

import RuleSet from './ruleset';
import Namespace from './namespace';
import Rule from './rule';

// Setup private namespace for class properties
export const NAMESPACE = new Namespace();
const { get, set } = NAMESPACE.proxies();

export default class RuleBook {
  constructor( callback ) {
    set(this, 'content', new Map());

    if( 'function' === typeof callback ) {
      callback.call(this, Rule.rules);
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

    if( content.has(action) ) {
      ruleSet = content.get(action);
      ruleSet.addMany(rules);
    } else {
      ruleSet = new RuleSet(action, rules);
      content.set(action, ruleSet);
    }

    return this;
  }
}
