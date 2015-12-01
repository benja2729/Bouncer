import { expect } from 'chai';

import Authorizer, { NAMESPACE } from '../../../src/classes/authorizer';
import RuleBook from '../../../src/classes/rulebook';
import Rule, { STORE } from '../../../src/classes/rule';

const { get, set } = NAMESPACE.proxies();

describe('classes/authorizer', () => {

  describe('constructor()', () => {
    it('should throw Error when passed no arguments', () => {
      expect(() => {
        new Authorizer();
      }).to.throw(/two arguments/);
    });

    it('should throw Error when passed one argument', () => {
      expect(() => {
        new Authorizer(1);
      }).to.throw(/two arguments/);
    });

    it('should throw Error when passed three arguments', () => {
      expect(() => {
        new Authorizer(1,2,3);
      }).to.throw(/two arguments/);
    });

    it('should expect iterable roles', () => {
      expect(() => {
        new Authorizer(1, new RuleBook());
      }).to.throw(/iterable/);
    });

    it('should expect a RuleBook', () => {
      expect(() => {
        new Authorizer([], 2);
      }).to.throw(/RuleBook/);
    });
  });

  describe('authorize()', () => {
    const passingRule = new Rule({
      run: () => { return true; }
    });

    const failingRule = new Rule({
      run: () => { return false; }
    });

    const ruleBook = new RuleBook(function() {
      this.add('passing_action', passingRule);
      this.add('failing_action', failingRule);
    });

    const authorizer = new Authorizer([], ruleBook);

    it('should authorize passing actions', () => {
      let result = authorizer.authorize('passing_action');
      expect(result).to.be.true;
    });

    it('should authorize undefined actions', () => {
      let result = authorizer.authorize('undefined_action');
      expect(result).to.be.true;
    });

    it('should reject failing actions', () => {
      let result = authorizer.authorize('failing_action');
      expect(result).to.be.false;
    });
  });

});
