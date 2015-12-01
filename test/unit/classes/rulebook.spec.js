import { expect } from 'chai';

import RuleBook, { NAMESPACE } from '../../../src/classes/rulebook';
import RuleSet from '../../../src/classes/ruleset';
import Rule, { STORE } from '../../../src/classes/rule';
const { get, set } = NAMESPACE.proxies();

describe('classes/rulebook', () => {
  const passingRule = new Rule({
    run: () => { return true; }
  });

  const failingRule = new Rule({
    run: () => { return false; }
  });

  let book;

  beforeEach(() => {
    book = new RuleBook();
  });

  afterEach(() => {
    book = null;
  });

  describe('constructor', () => {
    it('should accept an init function', () => {
      expect(() => {
        new RuleBook(() => {});
      }).to.not.throw(Error);
    });

    it('should properly set "this" in the init function', () => {
      let book, context;
      book = new RuleBook(function() {
        context = this;
      });

      expect(book).to.equal(context);
    });

    it('should pass RULES to init function as a parameter', () => {
      let context;
      new RuleBook(function(rules) {
        context = rules;
      });

      expect(context).to.equal(STORE);
    });
  });

  describe('get()', () => {
    it('should return undefined if not set', () => {
      expect(book.get('undefined_action')).to.be.undefined;
    });

    it('should return a RuleSet', () => {
      book.add('test_action', passingRule);
      expect(book.get('test_action')).to.be.instanceOf(RuleSet);
    });
  });

  describe('has()', () => {
    it('should return false if not set', () => {
      expect(book.has('undefined_action')).to.be.false;
    });

    it('should return true if set', () => {
      book.add('test_action', passingRule);
      expect(book.has('test_action')).to.be.true;
    });
  });

  describe('add()', () => {
    it('should register action if not set', () => {
      let content = get(book, 'content');

      book.add('test_action', passingRule);

      expect(content.has('test_action')).to.be.true;
    });

    it('should add rule to action if not set', () => {
      let content = get(book, 'content');

      book.add('test_action', passingRule);
      let ruleSet = content.get('test_action');

      expect(ruleSet.has(passingRule)).to.be.true;
    });

    it('should add rule to action if set', () => {
      let content = get(book, 'content'),
          rule = new Rule({
            run: () => { return true; }
          }), result;

      content.set('test_action', new RuleSet('test_action', [rule]));
      book.add('test_action', passingRule);
      let ruleSet = content.get('test_action');

      result = ruleSet.has(rule) && ruleSet.has(passingRule);

      expect(result).to.be.true;
    });
  });

  describe('addMany()', () => {
    it('should register action if not set', () => {
      let content = get(book, 'content');

      book.addMany('test_action', []);

      expect(content.has('test_action')).to.be.true;
    });

    it('should add rules to action if not set', () => {
      let content = get(book, 'content'), result;

      book.addMany('test_action', [failingRule, passingRule]);
      let ruleSet = content.get('test_action');

      result = ruleSet.has(failingRule) && ruleSet.has(passingRule);

      expect(result).to.be.true;
    });

    it('should add rules to action if set', () => {
      let content = get(book, 'content'),
          rule = new Rule({
            run: () => { return true; }
          }), result;

      content.set('test_action', new RuleSet('test_action', [rule]));
      book.addMany('test_action', [failingRule, passingRule]);
      let ruleSet = content.get('test_action');

      result = ruleSet.has(rule) && ruleSet.has(failingRule) && ruleSet.has(passingRule);

      expect(result).to.be.true;
    });

  });

});