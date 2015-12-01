import { expect } from 'chai';

import {
  assert, getCache, isIterable
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

  describe('getCache()', () => {
    const noop = () => {};
    let map;

    beforeEach(() => {
      map = new Map();
    });

    afterEach(() => {
      map = null;
    });

    it('should throw an Error when passed a non-map object', () => {
      expect(() => {
        getCache({}, 'noop', noop);
      }).to.throw(Error);
    });

    it('should throw Error if callback is not a function', () => {
      expect(() => {
        getCache(map, 'noop', 1);
      }).to.throw(TypeError);
    });

    it('should eagerly return value if set', () => {
      map.set('foo', true);

      let result = getCache(map, 'foo', () => {
        return false;
      });

      expect(result).to.be.true;
    });

    it('should register key if not set', () => {
      getCache(map, 'foo', noop);

      expect(map.has('foo')).to.be.true;
    });

    it('should run callback if not set', () => {
      let result = false;

      getCache(map, 'foo', () => {
        result = true;
      });

      expect(result).to.be.true;
    });

    it('should return callback value if not set', () => {
      let result = false;

      result = getCache(map, 'foo', () => {
        return true;
      });

      expect(result).to.be.true;
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
