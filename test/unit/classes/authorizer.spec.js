import { expect } from 'chai';

import Authorizer, { NAMESPACE } from '../../../src/classes/authorizer';
import RuleBook from '../../../src/classes/rulebook';
import Rule, { STORE } from '../../../src/classes/rule';

const { get, set } = NAMESPACE.proxies();

describe('classes/authorizer', () => {

  describe('static create()', () => {
    it('should require an init function', () => {
      expect(() => {
        Authorizer.create();
      }).to.throw(TypeError);
    });

    it('should return an Authorizer instance', () => {
      let instance = Authorizer.create([], () => {});
      expect(instance).to.be.instanceof(Authorizer);
    });
  });

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
      }).to.throw(TypeError);
    });

    it('should expect a RuleBook', () => {
      expect(() => {
        new Authorizer([], 2);
      }).to.throw(TypeError);
    });
  });

  describe('authorize()', () => {
    const passingRule = new Rule({
      run: () => { return true; }
    });

    const failingRule = new Rule({
      run: () => { return false; }
    });

    const ruleBook = new RuleBook( (book) => {
      book.add('passing_action', passingRule);
      book.add('failing_action', failingRule);
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
