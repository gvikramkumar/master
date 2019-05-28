import {ruleUtil} from './rule-util';
import _ from 'lodash';
import {AllocationRule} from '../models/allocation-rule';


/*
test coverage:
* createSelectArrays,
* parseSelect,
* createSelect,
addRuleNameAndDescription,
* getRuleDescription

  // exported
* createSelectArrays,
* parseSelect,
* createSelect,
addRuleNameAndDescription,
* getRuleDescription,

// for testing only
getMatchText,
getMatchTextArray,
addMatches,
addSelects,
addDescription
*/

describe('ruleUtil tests', () => {
  const sut = ruleUtil;
  const noStringRtn = {cond: undefined, arr: []};

  describe('parseSelect tests', () => {
/*

 */
    it('should handle undefined, null, empty string, string with spaces', () => {
      const arr = [];
      arr.push(sut.parseSelect(undefined));
      arr.push(sut.parseSelect(null));
      arr.push(sut.parseSelect(''));
      arr.push(sut.parseSelect('    '));
      expect(arr).toEqual([
        noStringRtn,
        noStringRtn,
        noStringRtn,
        noStringRtn,
        ]
      );
    });

    it('should throw if no conditional', () => {
      expect(() => sut.parseSelect('()')).toThrowError('ruleUtil.parseSelect missing conditional or array values: ()');
    });

    it('should throw if no conditional - spaces', () => {
      expect(() => sut.parseSelect(' ( ) ')).toThrowError('ruleUtil.parseSelect missing conditional or array values: ( )');
    });

    it('should throw if conditional, but no values', () => {
      expect(() => sut.parseSelect('IN ()')).toThrowError('ruleUtil.parseSelect missing conditional or array values: IN ()');
    });

    it('should throw if conditional, but no values - spaces', () => {
      expect(() => sut.parseSelect(' IN ( ) ')).toThrowError('ruleUtil.parseSelect missing conditional or array values: IN ( )');
    });

    it('should handle one conditional', () => {
      expect(sut.parseSelect('one (val)').cond).toBe('one');
    });

    it('should handle one conditional - spaces', () => {
      expect(sut.parseSelect('  one   (val)').cond).toBe('one');
    });

    it('should handle multiple conditionals', () => {
      expect(sut.parseSelect('one two three (val)').cond).toBe('one two three');
    });

    it('should handle multiple conditionals - spaces', () => {
      expect(sut.parseSelect('  one   two three   (val)').cond).toBe('one two three');
    });

    it('should handle one value', () => {
      expect(sut.parseSelect(`cond ('one')`).arr).toEqual(['one']);
    });

    it('should handle one value - spaces', () => {
      expect(sut.parseSelect(`  cond   ('one')`).arr).toEqual(['one']);
    });

    it('should handle multiple values', () => {
      expect(sut.parseSelect(`cond ('one', 'two', 'three')`).arr).toEqual(['one', 'two', 'three']);
    });

    it('should handle multiple values - spaces', () => {
      expect(sut.parseSelect(` cond  (  'one',  'two',   'three'  )`).arr).toEqual(['one', 'two', 'three']);
    });

    it('should handle multiple values - double quotes', () => {
      expect(sut.parseSelect(`cond ("one", "two", "three")`).arr).toEqual(['one', 'two', 'three']);
    });

    it('should handle multiple values - spaces - double quotes', () => {
      expect(sut.parseSelect(` cond  (  "one",  "two",   "three"  )`).arr).toEqual(['one', 'two', 'three']);
    });

    it('should handle multiple values - mixed quotes', () => {
      expect(sut.parseSelect(`cond ("one", 'two', "three")`).arr).toEqual(['one', 'two', 'three']);
    });

    it('should handle unquoted values - one value', () => {
      expect(sut.parseSelect('cond (one)').arr).toEqual(['one']);
    });

    it('should handle unquoted values - one value - spaces', () => {
      expect(sut.parseSelect('  cond   (one)').arr).toEqual(['one']);
    });

    it('should handle unquoted values - multiple values', () => {
      expect(sut.parseSelect(`cond (one, 'two', three)`).arr).toEqual(['one', 'two', 'three']);
    });

    it('should handle unquoted values - multiple values - spaces', () => {
      expect(sut.parseSelect(` cond  (  one,  two,   three  )`).arr).toEqual(['one', 'two', 'three']);
    });

  });


  /*
    let parse = parseSelect(rule.sl1Select);
  rule.salesSL1CritCond = parse.cond;
  rule.salesSL1CritChoices = parse.arr;

  parse = parseSelect(rule.sl2Select);
  rule.salesSL2CritCond = parse.cond;
  rule.salesSL2CritChoices = parse.arr;

  parse = parseSelect(rule.sl3Select);
  rule.salesSL3CritCond = parse.cond;
  rule.salesSL3CritChoices = parse.arr;

  parse = parseSelect(rule.prodTGSelect);
  rule.prodTGCritCond = parse.cond;
  rule.prodTGCritChoices = parse.arr;

  parse = parseSelect(rule.prodBUSelect);
  rule.prodBUCritCond = parse.cond;
  rule.prodBUCritChoices = parse.arr;

  parse = parseSelect(rule.prodPFSelect);
  rule.prodPFCritCond = parse.cond;
  rule.prodPFCritChoices = parse.arr;

  parse = parseSelect(rule.scmsSelect);
  rule.scmsCritCond = parse.cond;
  rule.scmsCritChoices = parse.arr;

  parse = parseSelect(rule.beSelect);
  rule.beCritCond = parse.cond;
  rule.beCritChoices = parse.arr;

   */
  it('createSelectArrays', () => {
    const rule = <AllocationRule>{
      sl1Select: `one1 ('two1')`,
      sl2Select: `one2 ('two2')`,
      sl3Select: `one3 ('two3')`,
      prodTGSelect: `one4 ('two4')`,
      prodBUSelect: `one5 ('two5')`,
      prodPFSelect: `one6 ('two6')`,
      scmsSelect: `one7 ('two7')`,
      beSelect: `one8 ('two8')`
    };
    sut.createSelectArrays(rule);
    expect(rule.salesSL1CritCond).toBe('one1');
    expect(rule.salesSL1CritChoices).toEqual(['two1']);
    expect(rule.salesSL2CritCond).toBe('one2');
    expect(rule.salesSL2CritChoices).toEqual(['two2']);
    expect(rule.salesSL3CritCond).toBe('one3');
    expect(rule.salesSL3CritChoices).toEqual(['two3']);
    expect(rule.prodTGCritCond).toBe('one4');
    expect(rule.prodTGCritChoices).toEqual(['two4']);
    expect(rule.prodBUCritCond).toBe('one5');
    expect(rule.prodBUCritChoices).toEqual(['two5']);
    expect(rule.prodPFCritCond).toBe('one6');
    expect(rule.prodPFCritChoices).toEqual(['two6']);
    expect(rule.scmsCritCond).toBe('one7');
    expect(rule.scmsCritChoices).toEqual(['two7']);
    expect(rule.beCritCond).toBe('one8');
    expect(rule.beCritChoices).toEqual(['two8']);
  });

  describe('createSelect tests', () => {

    it ('should handle no cond and no arr', () => {
      expect(sut.createSelect('', undefined)).toBe('');
    });

    it ('should handle no cond and empty arr', () => {
      expect(sut.createSelect('', [])).toBe('');
    });

    it ('should handle no cond and arr of empty space', () => {
      expect(sut.createSelect('', ['', '  '])).toBe('');
    });

    it ('should throw for no cond and arr with one value', () => {
      expect(() => sut.createSelect('', ['one'])).toThrowError(`ruleUtil.createSelect: missing cond or choices, cond: , choices: one`);
    });

    it ('should throw for no cond and arr with values', () => {
      expect(() => sut.createSelect('', ['one', 'two'])).toThrowError(`ruleUtil.createSelect: missing cond or choices, cond: , choices: one, two`);
    });

    it ('should throw for cond and no choices', () => {
      expect(() => sut.createSelect('cond', [])).toThrowError(`ruleUtil.createSelect: missing cond or choices, cond: cond, choices: `);
    });

    it ('should handle one cond one arr', () => {
      expect(sut.createSelect('cond1', ['one'])).toBe(` cond1 ( 'one' ) `);
    });

    it ('should handle two cond one arr', () => {
      expect(sut.createSelect('cond1 cond2', ['one'])).toBe(` cond1 cond2 ( 'one' ) `);
    });

    it ('should handle one cond multiple arr', () => {
      expect(sut.createSelect('cond1', ['one', 'two', 'three'])).toBe(` cond1 ( 'one', 'two', 'three' ) `);
    });

    it ('should handle two cond multiple arr', () => {
      expect(sut.createSelect('cond1 cond2', ['one', 'two', 'three'])).toBe(` cond1 cond2 ( 'one', 'two', 'three' ) `);
    });

  });

  describe('getRuleDescription tests', () => {

    it('should handle empty string', () => {
      expect(sut.getRuleDescription({desc: ''})).toBe('<table style=\'border:none\'><tr><td></td><td style="padding-left: 20px;"></td></tr></table>');
    });

    it('should handle empty string with spaces', () => {
      expect(sut.getRuleDescription({desc: '   '})).toBe('<table style=\'border:none\'><tr><td></td><td style="padding-left: 20px;"></td></tr></table>');
    });

    it('should handle empty string with newline', () => {
      expect(sut.getRuleDescription({desc: '\n'})).toBe('<table style=\'border:none\'><tr><td></td><td style="padding-left: 20px;"></td></tr></table>');
    });

    it('should handle one name/value', () => {
      expect(sut.getRuleDescription({desc: 'name:value'})).toBe('<table style=\'border:none\'><tr><td>name</td><td style="padding-left: 20px;">value</td></tr></table>');
    });

    it('should handle one name/value - spaces', () => {
      expect(sut.getRuleDescription({desc: ' name:   value  '})).toBe('<table style=\'border:none\'><tr><td>name</td><td style="padding-left: 20px;">value</td></tr></table>');
    });

    it('should handle multiple name/values', () => {
      expect(sut.getRuleDescription({desc: `NAME ONE:value one\nNAME TWO:value two\nNAME THREE:value three\n`})).toBe('<table style=\'border:none\'><tr><td>NAME ONE</td><td style="padding-left: 20px;">value one</td></tr><tr><td>NAME TWO</td><td style="padding-left: 20px;">value two</td></tr><tr><td>NAME THREE</td><td style="padding-left: 20px;">value three</td></tr></table>');
    });

    it('should handle multiple name/values - spaces', () => {
      expect(sut.getRuleDescription({desc: ` NAME ONE :  value one  \n   NAME TWO  :value two  \n  NAME THREE:value three\n  `})).toBe('<table style=\'border:none\'><tr><td>NAME ONE</td><td style="padding-left: 20px;">value one</td></tr><tr><td>NAME TWO</td><td style="padding-left: 20px;">value two</td></tr><tr><td>NAME THREE</td><td style="padding-left: 20px;">value three</td></tr></table>');
    });

  });

  fdescribe('getMatchText tests', () => {
    const salesMatches = [{match: 'SL1'}, {match: 'SL2'}, {match: 'SL3'}, {match: 'SL4'}, {match: 'SL5'}, {match: 'SL6'}];
    const productMatches = [{match: 'BU'}, {match: 'PF'}, {match: 'TG'}]; // no PID
    const scmsMatches = [{match: 'SCMS'}];
    const legalEntityMatches = [{match: 'Business Entity', abbrev: 'LE'}];
    const beMatches = [{match: 'BE', abbrev: 'IBE'}, {match: 'Sub BE', abbrev: 'ISBE'}];
    const countryMatches = [{name: 'Sales Country Name', value: 'sales_country_name', abbrev: 'CNT'}];
    const extTheaterMatches = [{name: 'External Theater Name', value: 'ext_theater_name', abbrev: 'EXTTH'}];

    it('should return empty string if no value, empty string, or string with spaces only', () => {
      expect(sut.test.getMatchText([], '', undefined)).toBe('');
      expect(sut.test.getMatchText([], '', '')).toBe('');
      expect(sut.test.getMatchText([], '', '   ')).toBe('');
    });

    it('should find item per prop and return that prop', () => {
      expect(sut.test.getMatchText(salesMatches, 'match', 'SL1')).toBe('SL1');
      expect(sut.test.getMatchText(salesMatches, 'match', ' SL1 ')).toBe('SL1'); // spaces
      expect(sut.test.getMatchText(salesMatches, 'match', 'SL2')).toBe('SL2');
      expect(sut.test.getMatchText(salesMatches, 'match', 'SL3')).toBe('SL3');
      expect(sut.test.getMatchText(salesMatches, 'match', 'SL4')).toBe('SL4');
      expect(sut.test.getMatchText(salesMatches, 'match', 'SL5')).toBe('SL5');
      expect(sut.test.getMatchText(salesMatches, 'match', 'SL6')).toBe('SL6');

      expect(sut.test.getMatchText(productMatches, 'match', 'TG')).toBe('TG');
      expect(sut.test.getMatchText(productMatches, 'match', 'BU')).toBe('BU');
      expect(sut.test.getMatchText(productMatches, 'match', 'PF')).toBe('PF');

      expect(sut.test.getMatchText(scmsMatches, 'match', 'SCMS')).toBe('SCMS');

      expect(sut.test.getMatchText(legalEntityMatches, 'match', 'Business Entity')).toBe('LE');

      expect(sut.test.getMatchText(beMatches, 'match', 'BE')).toBe('IBE');
      expect(sut.test.getMatchText(beMatches, 'match', 'Sub BE')).toBe('ISBE');

      expect(sut.test.getMatchText(countryMatches, 'value', 'sales_country_name')).toBe('CNT');

      expect(sut.test.getMatchText(extTheaterMatches, 'value', 'ext_theater_name')).toBe('EXTTH');
    });

    it('should find item by prop and return abbrev', () => {
      expect(sut.test.getMatchText(beMatches, 'match', 'Sub BE')).toBe('ISBE');
    });


/*
    describe('getMatchTextArray tests', () => {
      const glSegmentsMatchesProp = [{name: 'Account', value: 'ACCOUNT', abbrev: 'ACT'}, {name: 'Sub Account', value: 'SUB ACCOUNT', abbrev: 'SUBACT'},
        {name: 'Company', value: 'COMPANY', abbrev: 'COMP'}];
      const glSegmentsMatchesAbbrev = [{name: 'Account', value: 'ACCOUNT', abbrev: 'ACT'}, {name: 'Sub Account', value: 'SUB ACCOUNT', abbrev: 'SUBACT'},
        {name: 'Company', value: 'COMPANY', abbrev: 'COMP'}];

    // str += rule.glSegmentsMatch.length ? getMatchTextArray(glSegmentsMatches, 'value', rule.glSegmentsMatch) : '';

      it('should handle undefined', () => {
        expect(sut.test.getMatchTextArray(glSegmentsMatchesProp, 'value', undefined)).toBe('');
      });

      it('should handle empty array', () => {
        expect(sut.test.getMatchTextArray(glSegmentsMatchesProp, 'value', [])).toBe('');
      });

    });
*/


    /*
        it('should return empty string if empty string', () => {
          expect(sut.test.getMatchText('')).toBe('');
        });
    */

  });

});






