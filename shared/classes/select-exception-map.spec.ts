import {SelectExceptionIndexMap, SelectExceptionMap} from './select-exception-map';
import {AllocationRule} from '../models/allocation-rule';
import {ruleUtil} from '../misc/rule-util';

/*
*getslectarray
*getselectstring
parserules
*getselectarrayfromrule
*verifyentryinmaparray
*findSelectInMapArray

 */
describe('SelectExceptionMap tests', () => {
  let sut, one, two, three;
  beforeEach(() => {
    sut = new SelectExceptionMap();
    one = {selectArr: ['NOT IN', 'ONE'], index: 1};
    two = {selectArr: ['IN', 'TWO', 'THREE'], index: 2};
    three = {selectArr: ['NOT IN', 'FOUR'], index: 3};
    sut.sl1Map = [one, two, three];
    sut.sl1Idx = 3;
  });

  it('Should have a map for each prefix', () => {
    ['sl1', 'sl2', 'sl3', 'tg', 'bu', 'pf', 'scms', 'ibe'].forEach(prefix => {
      const arr = sut[`${prefix}Map`];
      if (!arr) {
        fail(`failed to find map for prefix: ${prefix}`);
      }
    });
  });

  it('getSelectArray', () => {
    const results = [];
    expect(sut.getSelectArray('not in', ['one', 'two'])).toEqual(['NOT IN', 'ONE', 'TWO']);
    expect(sut.getSelectArray('in', ['one'])).toEqual(['IN', 'ONE']);
  });

  it('verifyEntryInMapArray tests', () => {
    expect(sut.verifyEntryInMapArray(sut.sl1Map[1], two.selectArr)).toBe(true);
    expect(sut.verifyEntryInMapArray(sut.sl1Map[1], ['IN', 'THREE', 'TWO'])).toBe(true); // order shoudln't matter
    expect(sut.verifyEntryInMapArray(sut.sl1Map[1], ['IN', 'NOPE'])).toBe(false);
  });

  it('findSelectInMapArray: should return undefined if no map arr', () => {
    expect(sut.findSelectInMapArray([], ['anything here'])).toBeUndefined();
  });

  it('findSelectInMapArray: should find and not find', () => {
    expect(sut.findSelectInMapArray([], ['IN', 'NOPE'])).toBeUndefined(); // if mapArr is empty, returns nothing
    expect(sut.findSelectInMapArray(sut.sl1Map, ['IN', 'NOPE'])).toBeUndefined(); // if not found, returns nothing
    expect(sut.findSelectInMapArray(sut.sl1Map, one.selectArr)).toEqual(one);
    expect(sut.findSelectInMapArray(sut.sl1Map, two.selectArr)).toEqual(two);
    expect(sut.findSelectInMapArray(sut.sl1Map, ['IN', 'THREE', 'TWO'])).toEqual(two); // order shoudln't matter
    expect(sut.findSelectInMapArray(sut.sl1Map, three.selectArr)).toEqual(three);
  });

  describe('getSelectString tests', () => {
    /*
    * returns if in arr
    * returns if not in arr and is added to arr
     */

    it('should return correct string if already in array', () => {
      let result = sut.getSelectString('sl1', 'in', ['two', 'three']); // should be case insensitive
      expect(sut.sl1Map.length).toBe(3); // didn't add to array, found it
      expect(result).toBe('SL1E2');

      result = sut.getSelectString('sl1', 'in', ['three', 'two']); // order shouldn't matter
      expect(sut.sl1Map.length).toBe(3); // didn't add to array, found it
      expect(result).toBe('SL1E2');
    });

    it('should return correct string if not in array, and add to the array', () => {
      const result = sut.getSelectString('sl1', 'not in', ['new', 'entry']); // order shouldn't matter
      expect(sut.sl1Map.length).toBe(4); // didn't add to array, found it
      expect(result).toBe('SL1E4');
      expect(sut.verifyEntryInMapArray(sut.sl1Map[3], ['NOT IN', 'NEW', 'ENTRY'])).toBe(true);
    });

  });

  it('getSelectArrayFromRule tests', () => {
    const rule = new AllocationRule();
    rule.salesSL1CritCond = 'IN';
    rule.salesSL1CritChoices = ['one', 'two', 'three'];
    expect(sut.getSelectArrayFromRule('sl1', rule)).toEqual(['IN', 'ONE', 'TWO', 'THREE']);
  });

  /*
    sl1Map: SelectExceptionIndexMap[] = [];
  sl2Map: SelectExceptionIndexMap[] = [];
  sl3Map: SelectExceptionIndexMap[] = [];
  tgMap: SelectExceptionIndexMap[] = [];
  buMap: SelectExceptionIndexMap[] = [];
  pfMap: SelectExceptionIndexMap[] = [];
  scmsMap: SelectExceptionIndexMap[] = [];
  ibeMap: SelectExceptionIndexMap[] = [];

   */
  fdescribe('parseRules tests', () => {
    beforeEach(() => {
      sut = new SelectExceptionMap();
    });

    it('should do nothing if no rules', () => {
      sut.parseRules([]);
      expect(sut.sl1Idx).toBe(0);
      expect(sut.sl2Idx).toBe(0);
      expect(sut.sl3Idx).toBe(0);
      expect(sut.tgIdx).toBe(0);
      expect(sut.buIdx).toBe(0);
      expect(sut.pfIdx).toBe(0);
      expect(sut.scmsIdx).toBe(0);
      expect(sut.ibeIdx).toBe(0);
      expect(sut.sl1Map.length).toBe(0);
      expect(sut.sl2Map.length).toBe(0);
      expect(sut.sl3Map.length).toBe(0);
      expect(sut.tgMap.length).toBe(0);
      expect(sut.buMap.length).toBe(0);
      expect(sut.pfMap.length).toBe(0);
      expect(sut.scmsMap.length).toBe(0);
      expect(sut.ibeMap.length).toBe(0);
    });

    it('should handle one rule', () => {
      const rules = [
        {
          name: 'ONE-TWO-SL1E1',
          sl1Select: `IN ('AMERICAS', 'JAPAN')`
        }
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(1);
      expect(sut.sl2Idx).toBe(0);
      expect(sut.sl3Idx).toBe(0);
      expect(sut.tgIdx).toBe(0);
      expect(sut.buIdx).toBe(0);
      expect(sut.pfIdx).toBe(0);
      expect(sut.scmsIdx).toBe(0);
      expect(sut.ibeIdx).toBe(0);

      // isEqual checks object type, so have to convert type to object to compare, or make correct type in expected
      const arr = sut.sl1Map.map(x => Object.assign({}, x));
      expect(arr).toEqual([{ selectArr: [ 'IN', 'AMERICAS', 'JAPAN' ], index: 1 }]);
      expect(sut.sl1Map).toEqual([new SelectExceptionIndexMap([ 'IN', 'AMERICAS', 'JAPAN' ], 1)]);

      expect(sut.sl2Map.length).toBe(0);
      expect(sut.sl3Map.length).toBe(0);
      expect(sut.tgMap.length).toBe(0);
      expect(sut.buMap.length).toBe(0);
      expect(sut.pfMap.length).toBe(0);
      expect(sut.scmsMap.length).toBe(0);
      expect(sut.ibeMap.length).toBe(0);
    });

  });

});







