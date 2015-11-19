
import {
  Map, eachKey, invokeEvery, hasIntersection
} from 'bouncer/modules';

function defaultMatcher( activityRoles ) {
  return function( userRoles ) {
    return hasIntersection(userRoles, activityRoles);
  }
}

export default class Bouncer {
  constructor( roles, activities={} ) {
    this._roles = roles;
    this._cache = new Map();
    this._rules = new Map();

    eachKey(activities, ( activity, activityRoles ) => {
      this.allow(activity, defaultMatcher(activityRoles));
    });
  }

  get roles() {
    return this._roles;
  }
  set roles(roles) {
    throw new Error(`Cannot set property 'roles' on '${this.toString()}'`);
  }

  allow( activity, callback ) {
    this._cache.release(activity);

    let rules = this._rules, activityRules;

    if( rules.has(activity) ) {
      activityRules = rules.get(activity);
    } else {
      activityRules = [];
      rules.set(activity, activityRules);
    }

    activityRules.push( callback );
    return activityRules;
  }

  authorize( activity ) {
    let cache = this._cache;

    if( cache.has(activity) ) {
      return cache.get(activity);
    }

    let rules = this._rules.get(activity);
    let validation = invokeEvery(rules, [this.roles], this);
    cache.set(activity, validation);
    return validation;
  }
}

if( window ) {
  window.Bouncer = Bouncer;
}
