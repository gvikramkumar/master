import {injector} from '../server/lib/common/inversify.config';
const inj = injector; // required to import reflect-metadata before any injection
import {mgc} from '../server/lib/database/mongoose-conn';
import AllocationRuleRepo from '../server/api/common/allocation-rule/repo';
import AnyObj from '../shared/models/any-obj';
import * as fs from 'fs';
import * as _ from 'lodash';
import LookupRepo from '../server/api/lookup/repo';

const ruleRepo = new AllocationRuleRepo();
const lookupRepo = new LookupRepo();
let drivers, periods;
/*
get A/I >> get new name >> update all with that name to new name... done
 */

class SelectExceptionIndexMap {
  constructor(public selectArr: string[], public index) {
  }
}

class SelectExceptionMap {
  sl1Idx = 0;
  sl2Idx = 0;
  sl3Idx = 0;
  tgIdx = 0;
  buIdx = 0;
  pfIdx = 0;
  scmsIdx = 0;
  beIdx = 0;
  sl1Map: SelectExceptionIndexMap[] = [];
  sl2Map: SelectExceptionIndexMap[] = [];
  sl3Map: SelectExceptionIndexMap[] = [];
  tgMap: SelectExceptionIndexMap[] = [];
  buMap: SelectExceptionIndexMap[] = [];
  pfMap: SelectExceptionIndexMap[] = [];
  scmsMap: SelectExceptionIndexMap[] = [];
  beMap: SelectExceptionIndexMap[] = [];

  getSelectArray(cond, choices) {
    return ([cond].concat(choices)).map(x => x.toUpperCase());
  }

  getSelectString(prop, cond, choices) {
    const mapArr = this[`${prop}Map`];
    const prefix = prop.toUpperCase();
    if (!cond || !choices.length) {
      return;
    }
    const selectArr = ([cond].concat(choices)).map(x => x.toUpperCase());
    if (!selectArr.length || selectArr.length === 1) {
      throw new Error(`SelectExceptionMap.getSl1SelectString: selectArray with length < 2, ${selectArr.length}`);
    }
    const map = this.findSelectInMapArray(mapArr, selectArr);
    if (map) {
      return `${prefix}E${map.index}`;
    } else {
      mapArr.push(new SelectExceptionIndexMap(selectArr, ++this[`${prop}Idx`]));
      return `${prefix}E${this[`${prop}Idx`]}`;
    }
  }

  findSelectInMapArray(mapArr, selectArr): SelectExceptionIndexMap {
    if (!mapArr.length) {
      return;
    }
    let found: SelectExceptionIndexMap;
    _.each(mapArr, map => {
      if (map.selectArr.length === selectArr.length && _.union(map.selectArr, selectArr).length === map.selectArr.length) {
        found = map;
        return false; // get out
      }
    });
    return found;
  }
}

const selectMap = new SelectExceptionMap();
const buf = [];
const header = ['Old Name', 'New Name', 'Duplicate', 'Description', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Country', 'External Theater', 'GL Segments',
  'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'BE Select', 'Status'
];
const props =       ['name', 'newName', 'duplicate', 'description', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
  'sl1Select', 'sl2Select', 'sl3Select', 'prodTGSelect', 'prodBUSelect', 'prodPFSelect', 'scmsSelect', 'beSelect', 'status'];

buf.push(header.toString());

Promise.all([
  ruleRepo.getMany({moduleId: 1}),
  ruleRepo.getManyLatestGroupByNameActiveInactive(1),
  lookupRepo.getValues(['drivers', 'periods'])
])
  .then(results => {
    const allRules = results[0];
    const latestRules = results[1];
    drivers = results[2][0];
    periods = results[2][1];

    latestRules.forEach((rule: AnyObj) => {
      const driver = _.find(drivers, {value: rule.driverName});
      if (!driver) {
        throw new Error(`Missing driver: ${rule.driverName}`);
      }
      const period = _.find(periods, {period: rule.period});
      if (!period) {
        throw new Error(`Missing period: ${rule.period}`);
      }
      createSelectArrays(rule);
      rule.newName = `${driver.abbrev || driver.value}-${period.abbrev || period.period}`;
      addMatches(rule);
      addSelects(rule, selectMap);

      buf.push(props.map(prop => {
        if (_.isArray(rule[prop]) && rule[prop].length) {
          return `${rule[prop].join('/')}`;
        } else {
          return rule[prop];
        }
      }).toString());
    });
    const fileName = 'rule-name-change.csv';
    fs.writeFileSync(fileName, buf.join('\n'));
    console.log(`${latestRules.length} rules processed to /dist/sandbox/${fileName}`);

/*
    console.log('>>>>>>> sl1');
    selectMap.sl1Map.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> sl2');
    selectMap.sl2Map.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> sl3');
    selectMap.sl3Map.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> tg');
    selectMap.tgMap.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> bu');
    selectMap.buMap.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> pf');
    selectMap.pfMap.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> scms');
    selectMap.scmsMap.forEach(x => console.log(x.index, x.selectArr));
    console.log('>>>>>>> be');
    selectMap.beMap.forEach(x => console.log(x.index, x.selectArr));
*/

    process.exit(0);
    // need to look for duplicates too, but your output would show that right? Sort by newname then?

  })

function getMatchText(values, prop, value) {
  const val = _.find(values, {[prop]: value});
  if (!val) {
    throw new Error(`getMatchText couldn't find: ${value} in prop: ${prop} of values: ${values}`);
  }
  return val.abbrev || val[prop];
}

function getMatchTextArray(values, prop, arr) {
  const rtn = [];
  arr.forEach(aval => {
    const val = _.find(values, {[prop]: aval});
    if (!val) {
      throw new Error(`getMatchText couldn't find: ${aval} in prop: ${prop} of values: ${values.map(x => x[prop])}`);
    }
    rtn.push(val.abbrev || val[prop]);
  });
  return rtn.join('');
}

const salesMatches = [{match: 'SL1'}, {match: 'SL2'}, {match: 'SL3'}, {match: 'SL4'}, {match: 'SL5'}, {match: 'SL6'}];
const productMatches = [{match: 'BU'}, {match: 'PF'}, {match: 'TG'}]; // no PID
const scmsMatches = [{match: 'SCMS'}];
const legalEntityMatches = [{match: 'Business Entity', abbrev: 'LE'}];
const beMatches = [{match: 'BE'}, {match: 'Sub BE', abbrev: 'SubBE'}];
const countryMatches = [{name: 'Sales Country Name', value: 'sales_country_name', abbrev: 'CNT'}];
const extTheaterMatches = [{name: 'External Theater Name', value: 'ext_theater_name', abbrev: 'EXT'}];
const glSegmentsMatches = [{name: 'Account', value: 'ACCOUNT', abbrev: 'ACCT'}, {name: 'Sub Account', value: 'SUB ACCOUNT', abbrev: 'SUBACCT'},
  {name: 'Company', value: 'COMPANY', abbrev: 'COMP'}];

function addMatches(rule) {
  let str = '';

  str += rule.salesMatch ? getMatchText(salesMatches, 'match', rule.salesMatch) : '';
  str += rule.productMatch ? getMatchText(productMatches, 'match', rule.productMatch) : '';
  str += rule.scmsMatch ? getMatchText(scmsMatches, 'match', rule.scmsMatch) : '';
  str += rule.beMatch ? getMatchText(beMatches, 'match', rule.beMatch) : '';
  str += rule.legalEntityMatch ? getMatchText(legalEntityMatches, 'match', rule.legalEntityMatch) : '';
  str += rule.countryMatch ? getMatchText(countryMatches, 'value', rule.countryMatch) : '';
  str += rule.extTheaterMatch ? getMatchText(extTheaterMatches, 'value', rule.extTheaterMatch) : '';
  str += rule.glSegmentsMatch && rule.glSegmentsMatch.length ? getMatchTextArray(glSegmentsMatches, 'value', rule.glSegmentsMatch) : '';

  if (str) {
    rule.newName += `-${str}`;
  }
}

function addSelects(rule, selectMap) {
  // order: SL1, SL2, SL3, TG, BU, PF, SCMS, BE
  let str = '';
  const sl1 = selectMap.getSelectString('sl1', rule.salesSL1CritCond, rule.salesSL1CritChoices);
  const sl2 = selectMap.getSelectString('sl2', rule.salesSL2CritCond, rule.salesSL2CritChoices);
  const sl3 = selectMap.getSelectString('sl3', rule.salesSL3CritCond, rule.salesSL3CritChoices);
  const tg = selectMap.getSelectString('tg', rule.prodTGCritCond, rule.prodTGCritChoices);
  const bu = selectMap.getSelectString('bu', rule.prodBUCritCond, rule.prodBUCritChoices);
  const pf = selectMap.getSelectString('pf', rule.prodPFCritCond, rule.prodPFCritChoices);
  const scms = selectMap.getSelectString('scms', rule.scmsCritCond, rule.scmsCritChoices);
  const be = selectMap.getSelectString('be', rule.beCritCond, rule.beCritChoices);
  str += sl1 ? `-${sl1}` : '';
  str += sl2 ? `-${sl2}` : '';
  str += sl3 ? `-${sl3}` : '';
  str += tg ? `-${tg}` : '';
  str += bu ? `-${bu}` : '';
  str += pf ? `-${pf}` : '';
  str += scms ? `-${scms}` : '';
  str += be ? `-${be}` : '';
  if (str) {
    rule.newName += str;
  }
}

function createSelectArrays(rule) {
  let parse = parseSelect(rule.sl1Select);
  rule.salesSL1CritCond = parse.cond;
  rule.salesSL1CritChoices = parse.arr;

  parse = parseSelect(rule.sl2Select);
  rule.salesSL2CritCond = parse.cond;
  rule.salesSL2CritChoices = parse.arr;

  parse = parseSelect(rule.sl3Select);
  rule.salesSL3CritCond = parse.cond;
  rule.salesSL3CritChoices = parse.arr;

  parse = parseSelect(rule.prodPFSelect);
  rule.prodPFCritCond = parse.cond;
  rule.prodPFCritChoices = parse.arr;

  parse = parseSelect(rule.prodBUSelect);
  rule.prodBUCritCond = parse.cond;
  rule.prodBUCritChoices = parse.arr;

  parse = parseSelect(rule.prodTGSelect);
  rule.prodTGCritCond = parse.cond;
  rule.prodTGCritChoices = parse.arr;

  parse = parseSelect(rule.scmsSelect);
  rule.scmsCritCond = parse.cond;
  rule.scmsCritChoices = parse.arr;

  parse = parseSelect(rule.beSelect);
  rule.beCritCond = parse.cond;
  rule.beCritChoices = parse.arr;
}

function parseSelect(str) {
  // we need to not only parse but also clear off if reset
  if (!str || !str.trim().length) {
    return {cond: undefined, arr: []};
  }
  const rtn: AnyObj = {};
  const idx = str.indexOf('(');
  rtn.cond = str.substr(0, idx).trim();
  rtn.arr = str.substr(idx).replace(/(\(|\)|'|")/g, '').trim().split(',');
  rtn.arr = rtn.arr.map(x => x.trim());
  return rtn;
}
