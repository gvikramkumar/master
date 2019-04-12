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

const buf = [];
const header = ['Old Name', 'New Name', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'Legal Entity Match', 'BE Match', 'Country', 'External Theater', 'GL Segments',
  'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'BE Select', 'Status'
];
const props =       ['name', 'newName', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'legalEntityMatch', 'beMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
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
      addSelects(rule);

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

    process.exit(0);
    // need to look for duplicates too, but your output would show that right? Sort by newname then?

  })

function createNewName(rule, driver, period) {
  rule.newName = `${driver.abbrev || driver.value}-${period.abbrev || period.period}`;
  addMatches(rule);
  addSelects(rule);
}

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

function addSelects(rule) {
  let str = '';

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
