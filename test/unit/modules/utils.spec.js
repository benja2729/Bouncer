import { expect } from 'chai';

import {
  assert, isIterable
} from '../../../src/modules/utils';

describe('modules/utils', () => {

  describe('assert()', () => {
    it('should noop when true', () => {
      expect(() => {
        assert('You shouldnt see this message', true);
      }).to.not.throw(Error);
    });

    it('should throw an Error when false', () => {
      expect(() => {
        assert('You should see this message', false);
      }).to.throw(Error);
    });

    it('should use passed message in Error', () => {
      expect(() => {
        assert('You should see this message', false);
      }).to.throw('You should see this message');
    });

    it('should throw passed Error', () => {
      let error = new TypeError('Test Error');

      expect(() => {
        assert(error, false);
      }).to.throw(error);
    });
  });

  describe('isIterable()', () => {
    it('should return a boolean', () => {
      expect(isIterable([])).to.be.a('boolean');
    });

    it('should return TRUE for Array', () => {
      expect(isIterable([])).to.be.true;
    });

    it('should return TRUE for Map', () => {
      expect(isIterable(new Map())).to.be.true;
    });

    it('should return TRUE for Set', () => {
      expect(isIterable(new Set())).to.be.true;
    });

    it('should return FALSE for empty params', () => {
      expect(isIterable()).to.be.false;
    });

    it('should return FALSE for UNDEFINED', () => {
      expect(isIterable(undefined)).to.be.false;
    });

    it('should return FALSE for NULL', () => {
      expect(isIterable(null)).to.be.false;
    });
  });

});
