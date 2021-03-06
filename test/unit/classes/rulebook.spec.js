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

  let book, content;

  beforeEach(() => {
    book = new RuleBook();
    content = get(book, 'content');
  });

  afterEach(() => {
    book = null;
  });

  describe('constructor()', () => {
    it('should accept an init function', () => {
      expect(() => {
        new RuleBook(() => {});
      }).to.not.throw(Error);
    });

    it('should pass instance to init function as first parameter', () => {
      let context, book;
      book = new RuleBook( ( ruleBook ) => {
        context = ruleBook;
      });

      expect(context).to.equal(book);
    });

    it('should pass RULES to init function as second parameter', () => {
      let context;
      new RuleBook( ( ruleBook, rules ) => {
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
      book.add('test_action', passingRule);

      expect(content.has('test_action')).to.be.true;
    });

    it('should add rule to action if not set', () => {
      book.add('test_action', passingRule);
      let ruleSet = content.get('test_action');

      expect(ruleSet.has(passingRule)).to.be.true;
    });

    it('should add rule to action if set', () => {
      let rule = new Rule({
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
      book.addMany('test_action', []);

      expect(content.has('test_action')).to.be.true;
    });

    it('should add rules to action if not set', () => {
      book.addMany('test_action', [failingRule, passingRule]);
      let ruleSet = content.get('test_action');

      let result = ruleSet.has(failingRule) && ruleSet.has(passingRule);

      expect(result).to.be.true;
    });

    it('should add rules to action if set', () => {
      let rule = new Rule({
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