
import Store from './store';
import { assert } from '../modules';

export const STORE = new Store();

export default class Rule {
  static get rules() { return STORE; }

  static isRuleHash( hash ) {
    return !( hash instanceof this ) && 'object' === typeof hash && 'function' === typeof hash.run;
  }

  constructor( hash ) {
    assert('The hash sent to Rule#constructor must have a "run" function', Rule.isRuleHash(hash));
    Object.assign(this, hash);
    Rule.rules.add(this);
  }

  unload() {
    return STORE.unload(this);
  }

  // Supported keys
  // id          = null;
  // tags        = [];
  // run         = null;
  // description = null;
}
