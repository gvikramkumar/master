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

  describe('getExceptionsFromName tests', () => {

    it('should get no exceptions - no exceptions', () => {
      expect(sut.getExceptionsFromName('DONT-MATTER')).toEqual([]);
    });

    it('should get no exceptions - bad exception ending', () => {
      expect(sut.getExceptionsFromName('DONT-MATTER-SL1EX')).toEqual([]);
    });

    it('should get exception with bad prefix', () => {
      expect(sut.getExceptionsFromName('DONT-MATTER-SLXE1')).toEqual(['SLXE1']);
    });

    it('should get exception with big number', () => {
      expect(sut.getExceptionsFromName('DONT-MATTER-SL1E12345')).toEqual(['SL1E12345']);
    });


  })

  describe('parseRules tests', () => {
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

    it('one rule, one map', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
        },
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

      (<any>expect(sut.sl1Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 }]);
      expect(sut.sl2Map.length).toBe(0);
      expect(sut.sl3Map.length).toBe(0);
      expect(sut.tgMap.length).toBe(0);
      expect(sut.buMap.length).toBe(0);
      expect(sut.pfMap.length).toBe(0);
      expect(sut.scmsMap.length).toBe(0);
      expect(sut.ibeMap.length).toBe(0);
    });

    it('2 rules, 2 exceptions', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
        },
        {
          name: 'DONT-MATTER-SL1E2',
          sl1Select: `IN ('SL1VAL')`,
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(2);

      (<any>expect(sut.sl1Map)).toEqualObj([
        { selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 },
        { selectArr: [ 'IN', 'SL1VAL' ], index: 2 },
      ]);
    });

    it('2 rules, 2 exceptions - backwards', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E2',
          sl1Select: `IN ('SL1VAL')`,
        },
        {
          name: 'DONT-MATTER-SL1E1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(2);

      (<any>expect(sut.sl1Map)).toEqualObj([
        { selectArr: [ 'IN', 'SL1VAL' ], index: 2 },
        { selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 },
      ]);
    });

    it('big number', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E1234',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
        },
        {
          name: 'DONT-MATTER-SL1E3',
          sl1Select: `IN ('SL1VAL')`,
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(1234);

      (<any>expect(sut.sl1Map)).toEqualObj([
        { selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1234 },
        { selectArr: [ 'IN', 'SL1VAL' ], index: 3 },
      ]);
    });

    it('one rule, one map each', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E1-SL2E1-SL3E1-TGE1-BUE1-PFE1-SCMSE1-IBEE1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl2Select: `IN ('AMERICAS2', 'JAPAN')`,
          sl3Select: `IN ('AMERICAS3', 'JAPAN')`,
          prodTGSelect: `IN ('AMERICAS4', 'JAPAN')`,
          prodBUSelect: `IN ('AMERICAS5', 'JAPAN')`,
          prodPFSelect: `IN ('AMERICAS6', 'JAPAN')`,
          scmsSelect: `IN ('AMERICAS7', 'JAPAN')`,
          beSelect: `IN ('AMERICAS8', 'JAPAN')`
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(1);
      expect(sut.sl2Idx).toBe(1);
      expect(sut.sl3Idx).toBe(1);
      expect(sut.tgIdx).toBe(1);
      expect(sut.buIdx).toBe(1);
      expect(sut.pfIdx).toBe(1);
      expect(sut.scmsIdx).toBe(1);
      expect(sut.ibeIdx).toBe(1);

      (<any>expect(sut.sl1Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.sl2Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS2', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.sl3Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS3', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.tgMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS4', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.buMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS5', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.pfMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS6', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.scmsMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS7', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.ibeMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS8', 'JAPAN' ], index: 1 }]);
    });

    it('duplicate rules don\'t matter', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E1-SL2E1-SL3E1-TGE1-BUE1-PFE1-SCMSE1-IBEE1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl2Select: `IN ('AMERICAS2', 'JAPAN')`,
          sl3Select: `IN ('AMERICAS3', 'JAPAN')`,
          prodTGSelect: `IN ('AMERICAS4', 'JAPAN')`,
          prodBUSelect: `IN ('AMERICAS5', 'JAPAN')`,
          prodPFSelect: `IN ('AMERICAS6', 'JAPAN')`,
          scmsSelect: `IN ('AMERICAS7', 'JAPAN')`,
          beSelect: `IN ('AMERICAS8', 'JAPAN')`
        },
        {
          name: 'DONT-MATTER-SL1E1-SL2E1-SL3E1-TGE1-BUE1-PFE1-SCMSE1-IBEE1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl2Select: `IN ('AMERICAS2', 'JAPAN')`,
          sl3Select: `IN ('AMERICAS3', 'JAPAN')`,
          prodTGSelect: `IN ('AMERICAS4', 'JAPAN')`,
          prodBUSelect: `IN ('AMERICAS5', 'JAPAN')`,
          prodPFSelect: `IN ('AMERICAS6', 'JAPAN')`,
          scmsSelect: `IN ('AMERICAS7', 'JAPAN')`,
          beSelect: `IN ('AMERICAS8', 'JAPAN')`
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(1);
      expect(sut.sl2Idx).toBe(1);
      expect(sut.sl3Idx).toBe(1);
      expect(sut.tgIdx).toBe(1);
      expect(sut.buIdx).toBe(1);
      expect(sut.pfIdx).toBe(1);
      expect(sut.scmsIdx).toBe(1);
      expect(sut.ibeIdx).toBe(1);

      (<any>expect(sut.sl1Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.sl2Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS2', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.sl3Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS3', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.tgMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS4', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.buMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS5', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.pfMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS6', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.scmsMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS7', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.ibeMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS8', 'JAPAN' ], index: 1 }]);
    });

    it('should handle multiple rules with multiple exceptions per match and some duplicates', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E1-SL2E1-SL3E1-TGE1-BUE1-PFE1-SCMSE1-IBEE1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl2Select: `IN ('AMERICAS2', 'JAPAN')`,
          sl3Select: `IN ('AMERICAS3', 'JAPAN')`,
          prodTGSelect: `IN ('AMERICAS4', 'JAPAN')`,
          prodBUSelect: `IN ('AMERICAS5', 'JAPAN')`,
          prodPFSelect: `IN ('AMERICAS6', 'JAPAN')`,
          scmsSelect: `IN ('AMERICAS7', 'JAPAN')`,
          beSelect: `IN ('AMERICAS8', 'JAPAN')`
        },
        {
          name: 'DONT-MATTER-SL1E2-SCMSE2',
          sl1Select: `NOT IN ('SL1VAL1')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2')`,
        },
        { // duplicate rules don't matter
          name: 'DONT-MATTER-SL1E2-SCMSE2',
          sl1Select: `NOT IN ('SL1VAL1')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2')`,
        },
        {
          name: 'DONT-MATTER-SL1E1-SL3E2-SCMSE3', // reuse of SL1E1
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl3Select: `NOT IN ('SL3VAL1')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2', 'SCMSVAL3')`,
        },
        {
          name: 'DONT-MATTER-SL1E3-SCMSE2',
          sl1Select: `NOT IN ('SL1VAL1', 'SL1VAL2')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2')`,
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(3);
      expect(sut.sl2Idx).toBe(1);
      expect(sut.sl3Idx).toBe(2);
      expect(sut.tgIdx).toBe(1);
      expect(sut.buIdx).toBe(1);
      expect(sut.pfIdx).toBe(1);
      expect(sut.scmsIdx).toBe(3);
      expect(sut.ibeIdx).toBe(1);

      (<any>expect(sut.sl1Map)).toEqualObj([
        { selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 },
        { selectArr: [ 'NOT IN', 'SL1VAL1' ], index: 2 },
        { selectArr: [ 'NOT IN', 'SL1VAL1', 'SL1VAL2' ], index: 3 },
        ]);
      (<any>expect(sut.sl2Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS2', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.sl3Map)).toEqualObj([
        { selectArr: [ 'IN', 'AMERICAS3', 'JAPAN' ], index: 1 },
        { selectArr: [ 'NOT IN', 'SL3VAL1' ], index: 2 },
      ]);
      (<any>expect(sut.tgMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS4', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.buMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS5', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.pfMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS6', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.scmsMap)).toEqualObj([
        { selectArr: [ 'IN', 'AMERICAS7', 'JAPAN' ], index: 1 },
        { selectArr: [ 'NOT IN', 'SCMSVAL1', 'SCMSVAL2' ], index: 2 },
        { selectArr: [ 'NOT IN', 'SCMSVAL1', 'SCMSVAL2', 'SCMSVAL3' ], index: 3 },
      ]);
      (<any>expect(sut.ibeMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS8', 'JAPAN' ], index: 1 }]);
    });

    it(`order shouldn't matter, selectArr entries will shift but will stay the same`, () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1E2-SCMSE2',
          sl1Select: `NOT IN ('SL1VAL1')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2')`,
        },
        { // duplicate rules don't matter
          name: 'DONT-MATTER-SL1E2-SCMSE2',
          sl1Select: `NOT IN ('SL1VAL1')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2')`,
        },
        {
          name: 'DONT-MATTER-SL1E1-SL3E2-SCMSE3', // reuse of SL1E1
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl3Select: `NOT IN ('SL3VAL1')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2', 'SCMSVAL3')`,
        },
        {
          name: 'DONT-MATTER-SL1E3-SCMSE2',
          sl1Select: `NOT IN ('SL1VAL1', 'SL1VAL2')`,
          scmsSelect: `NOT IN ('SCMSVAL1', 'SCMSVAL2')`,
        },
        {
          name: 'DONT-MATTER-SL1E1-SL2E1-SL3E1-TGE1-BUE1-PFE1-SCMSE1-IBEE1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
          sl2Select: `IN ('AMERICAS2', 'JAPAN')`,
          sl3Select: `IN ('AMERICAS3', 'JAPAN')`,
          prodTGSelect: `IN ('AMERICAS4', 'JAPAN')`,
          prodBUSelect: `IN ('AMERICAS5', 'JAPAN')`,
          prodPFSelect: `IN ('AMERICAS6', 'JAPAN')`,
          scmsSelect: `IN ('AMERICAS7', 'JAPAN')`,
          beSelect: `IN ('AMERICAS8', 'JAPAN')`
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(3);
      expect(sut.sl2Idx).toBe(1);
      expect(sut.sl3Idx).toBe(2);
      expect(sut.tgIdx).toBe(1);
      expect(sut.buIdx).toBe(1);
      expect(sut.pfIdx).toBe(1);
      expect(sut.scmsIdx).toBe(3);
      expect(sut.ibeIdx).toBe(1);

      (<any>expect(sut.sl1Map)).toEqualObj([
        { selectArr: [ 'NOT IN', 'SL1VAL1' ], index: 2 },
        { selectArr: [ 'IN', 'AMERICAS1', 'JAPAN' ], index: 1 },
        { selectArr: [ 'NOT IN', 'SL1VAL1', 'SL1VAL2' ], index: 3 },
      ]);
      (<any>expect(sut.sl2Map)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS2', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.sl3Map)).toEqualObj([
        { selectArr: [ 'NOT IN', 'SL3VAL1' ], index: 2 },
        { selectArr: [ 'IN', 'AMERICAS3', 'JAPAN' ], index: 1 },
      ]);
      (<any>expect(sut.tgMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS4', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.buMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS5', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.pfMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS6', 'JAPAN' ], index: 1 }]);
      (<any>expect(sut.scmsMap)).toEqualObj([
        { selectArr: [ 'NOT IN', 'SCMSVAL1', 'SCMSVAL2' ], index: 2 },
        { selectArr: [ 'NOT IN', 'SCMSVAL1', 'SCMSVAL2', 'SCMSVAL3' ], index: 3 },
        { selectArr: [ 'IN', 'AMERICAS7', 'JAPAN' ], index: 1 },
      ]);
      (<any>expect(sut.ibeMap)).toEqualObj([{ selectArr: [ 'IN', 'AMERICAS8', 'JAPAN' ], index: 1 }]);
    });

    it('exception: bad prefix', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1XE1',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      expect(() => sut.parseRules(rules)).toThrowError(`SelectExceptionMap.parseRules: bad prefix, exception: SL1XE1, rule name: DONT-MATTER-SL1XE1`);
    });

    it('exception: bad index value', () => {
      const rules = [
        {
          name: 'DONT-MATTER-SL1EX',
          sl1Select: `IN ('AMERICAS1', 'JAPAN')`,
        },
      ];
      rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      sut.parseRules(rules);
      expect(sut.sl1Idx).toBe(0); // skips it if not E\d+
    });


  });

});







