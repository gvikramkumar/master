import {SelectExceptionMap} from './select-exception-map';


fdescribe('SelectExceptionMap tests', () => {
  let emap, one, two, three;
  beforeEach(() => {
    emap = new SelectExceptionMap();
    one = {selectArr: ['NOT IN', 'ONE'], index: 1};
    two = {selectArr: ['IN', 'TWO', 'THREE'], index: 2};
    three = {selectArr: ['NOT IN', 'FOUR'], index: 3};
    emap.sl1Map = [one, two, three];
    emap.sl1Idx = 3;
  });

  it('Should have a map for each prefix', () => {
    ['sl1', 'sl2', 'sl3', 'tg', 'bu', 'pf', 'scms', 'ibe'].forEach(prefix => {
      const arr = emap[`${prefix}Map`];
      if (!arr) {
        fail(`failed to find map for prefix: ${prefix}`);
      }
    });
  });

  it('getSelectArray', () => {
    const results = [];
    results.push(emap.getSelectArray('not in', ['one', 'two']));
    results.push(emap.getSelectArray('in', ['one']));
    expect(results).toEqual([
      ['NOT IN', 'ONE', 'TWO'],
      ['IN', 'ONE'],
    ]);
  });

  it('verifyEntryInMapArray tests', () => {
    expect(emap.verifyEntryInMapArray(emap.sl1Map[1], two.selectArr)).toBe(true);
    expect(emap.verifyEntryInMapArray(emap.sl1Map[1], ['IN', 'THREE', 'TWO'])).toBe(true); // order shoudln't matter
    expect(emap.verifyEntryInMapArray(emap.sl1Map[1], ['IN', 'NOPE'])).toBe(false);
  });

  it('findSelectInMapArray: should return undefined if no map arr', () => {
    expect(emap.findSelectInMapArray([], ['anything here'])).toBeUndefined();
  });

  it('findSelectInMapArray: should find and not find', () => {
    expect(emap.findSelectInMapArray([], ['IN', 'NOPE'])).toBeUndefined(); // if mapArr is empty, returns nothing
    expect(emap.findSelectInMapArray(emap.sl1Map, ['IN', 'NOPE'])).toBeUndefined(); // if not found, returns nothing
    expect(emap.findSelectInMapArray(emap.sl1Map, one.selectArr)).toEqual(one);
    expect(emap.findSelectInMapArray(emap.sl1Map, two.selectArr)).toEqual(two);
    expect(emap.findSelectInMapArray(emap.sl1Map, ['IN', 'THREE', 'TWO'])).toEqual(two); // order shoudln't matter
    expect(emap.findSelectInMapArray(emap.sl1Map, three.selectArr)).toEqual(three);
  });

  describe('getSelectString tests', () => {
    /*
    * returns if in arr
    * returns if not in arr and is added to arr
     */

    it('should return correct string if already in array', () => {
      let result = emap.getSelectString('sl1', 'in', ['two', 'three']); // should be case insensitive
      expect(emap.sl1Map.length).toBe(3); // didn't add to array, found it
      expect(result).toBe('SL1E2');

      result = emap.getSelectString('sl1', 'in', ['three', 'two']); // order shouldn't matter
      expect(emap.sl1Map.length).toBe(3); // didn't add to array, found it
      expect(result).toBe('SL1E2');
    });

    it('should return correct string if not in array, and add to the array', () => {
      const result = emap.getSelectString('sl1', 'not in', ['new', 'entry']); // order shouldn't matter
      expect(emap.sl1Map.length).toBe(4); // didn't add to array, found it
      expect(result).toBe('SL1E4');
      expect(emap.verifyEntryInMapArray(emap.sl1Map[3], ['NOT IN', 'NEW', 'ENTRY'])).toBe(true);
    });

  });
  
});







