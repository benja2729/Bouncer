import { expect } from 'chai';

import RuleSet, { NAMESPACE } from '../../../src/classes/ruleset';
import Rule, { STORE } from '../../../src/classes/rule';
const { get, set } = NAMESPACE.proxies();

describe('classes/ruleset', () => {
  const passingRuleHash = {
    id: 'passingRule',
    run: () => { return true; }
  };

  const failingRuleHash = {
    id: 'failingRule',
    run: () => { return false; }
  };

  let ruleSet, content, passingRule, failingRule;

  beforeEach(() => {
    ruleSet = new RuleSet('test_action');
    content = get(ruleSet, 'content');

    passingRule = new Rule(passingRuleHash);
    failingRule = new Rule(failingRuleHash);
  });

  afterEach(() => {
    ruleSet = null;
    STORE.unloadAll();
  });

  describe('constructor()', () => {
    it('should require an action string as first parameter', () => {
      expect(() => {
        new RuleSet();
      }).to.throw(TypeError);
    });

    it('should support an iterable value as second parameter', () => {
      expect(() => {
        new RuleSet('test_action', []);
      }).to.not.throw(Error);
    });

    it('should add items in iterable param to content', () => {
      let ruleSet = new RuleSet('test_action', [passingRule, failingRule]),
          content = get(ruleSet, 'content'),
          result  = content.has(passingRule) && content.has(failingRule);

      expect(result).to.be.true;
    });
  });

  describe('has()', () => {
    it('should return true when Rule is in content', () => {
      ruleSet.add(passingRule);
      expect(ruleSet.has(passingRule)).to.be.true;
    });

    it('should return false when Rule is not in content', () => {
      expect(ruleSet.has(passingRule)).to.be.false;
    });
  });

  describe('add()', () => {
    it('should add the passed Rule to the content', () => {
      ruleSet.add(passingRule);

      expect(content.has(passingRule)).to.be.true;
    });

    it('should add the passed RuleHash to the content', () => {
      ruleSet.add(passingRuleHash);
      let rule = STORE.findById('passingRule');

      expect(content.has(rule)).to.be.true;
    });
  });

  describe('addMany()', () => {

  });

  describe('invoke()', () => {

  });

});
