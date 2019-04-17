import {injector} from '../server/lib/common/inversify.config';
const inj = injector; // required to import reflect-metadata before any injection
import {mgc} from '../server/lib/database/mongoose-conn';
import AllocationRuleRepo from '../server/api/common/allocation-rule/repo';
import AnyObj from '../shared/models/any-obj';
import * as fs from 'fs';
import * as _ from 'lodash';
import LookupRepo from '../server/api/lookup/repo';
import SubmeasureRepo from '../server/api/common/submeasure/repo';

const ruleRepo = new AllocationRuleRepo();
const smRepo = new SubmeasureRepo();
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
  ibeIdx = 0;
  sl1Map: SelectExceptionIndexMap[] = [];
  sl2Map: SelectExceptionIndexMap[] = [];
  sl3Map: SelectExceptionIndexMap[] = [];
  tgMap: SelectExceptionIndexMap[] = [];
  buMap: SelectExceptionIndexMap[] = [];
  pfMap: SelectExceptionIndexMap[] = [];
  scmsMap: SelectExceptionIndexMap[] = [];
  ibeMap: SelectExceptionIndexMap[] = [];

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
const ruleBuf = [];
const ruleHeader = ['Status', 'Old Name', 'New Name', 'Duplicates', 'Description', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'IBE Match', 'Legal Entity Match', 'Country', 'External Theater', 'GL Segments',
  'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'IBE Select', 'Created By', 'Created Date', 'Updated By', 'UpdatedDate'];
const ruleProps =       ['status', 'oldName', 'name', 'duplicates', 'desc', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'beMatch', 'legalEntityMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
  'sl1SelectQ', 'sl2SelectQ', 'sl3SelectQ', 'prodTGSelectQ', 'prodBUSelectQ', 'prodPFSelectQ', 'scmsSelectQ', 'beSelectQ', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate'];

ruleBuf.push(ruleHeader.toString());

const smBuf = [];
const smHeader = ['Status', 'Name',
  'Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5', 'Rule 6', 'Rule 7', 'Rule 8', 'Rule 9', 'Rule 10', 'Rule 11', 'Rule 12', 'Rule 13', 'Rule 14', 'Rule 15',
  'Old Rule 1', 'Old Rule 2', 'Old Rule 3', 'Old Rule 4', 'Old Rule 5', 'Old Rule 6', 'Old Rule 7', 'Old Rule 8', 'Old Rule 9', 'Old Rule 10', 'Old Rule 11', 'Old Rule 12', 'Old Rule 13', 'Old Rule 14', 'Old Rule 15',
  'Created By', 'Created Date', 'Updated By', 'UpdatedDate'];
const smProps =       ['status', 'name',
  'rules[0]', 'rules[1]', 'rules[2]', 'rules[3]', 'rules[4]', 'rules[5]', 'rules[6]', 'rules[7]', 'rules[8]', 'rules[9]', 'rules[10]', 'rules[11]', 'rules[12]', 'rules[13]', 'rules[14]',
  'oldRules[0]', 'oldRules[1]', 'oldRules[2]', 'oldRules[3]', 'oldRules[4]', 'oldRules[5]', 'oldRules[6]', 'oldRules[7]', 'oldRules[8]', 'oldRules[9]', 'oldRules[10]', 'oldRules[11]', 'oldRules[12]', 'oldRules[13]', 'oldRules[14]',
  'createdBy', 'createdDate', 'updatedBy', 'updatedDate'];

smBuf.push(smHeader.toString());

Promise.all([
  ruleRepo.getMany({moduleId: 1}),
  ruleRepo.getManyLatestGroupByNameActiveInactive(1),
  smRepo.getManyLatestGroupByNameActiveInactive(1),
  lookupRepo.getValues(['drivers', 'periods'])
])
  .then(results => {
    const latestRules = _.sortBy(results[1], 'name');
    const latestSms = _.sortBy(results[2], 'name');
    drivers = results[3][0];
    periods = results[3][1];

    latestRules.forEach((rule: AnyObj) => {
      const driver = _.find(drivers, {value: rule.driverName});
      if (!driver) {
        throw new Error(`Missing driver: ${rule.driverName}`);
      }
      const period = _.find(periods, {period: rule.period});
      if (!period) {
        throw new Error(`Missing period: ${rule.period}`);
      }
      rule.approvedOnce = 'Y'; // lots of them are missing this, we'll set them all to "Y" then
      createSelectArrays(rule);
      rule.oldName = rule.name;
      rule.name = `${driver.abbrev || driver.value}-${period.abbrev || period.period}`;
      addMatches(rule);
      addSelects(rule, selectMap);
      addDescription(rule, driver, period);
      quoteSelectText(rule);
    });
    addDuplicate(latestRules);

    latestRules.forEach(rule => {
      ruleBuf.push(ruleProps.map(prop => {
        if (_.isArray(rule[prop]) && rule[prop].length) {
          return `${_.get(rule, prop).join('/')}`;
        } else {
          return _.get(rule, prop);
        }
      }).toString());
    })

    const ruleFileName = 'rule-name-change.csv';
    fs.writeFileSync(ruleFileName, ruleBuf.join('\n'));
    console.log(`${latestRules.length} rules processed to /dist/sandbox/${ruleFileName}`);

    ///////////// submeasures
    
    latestSms.forEach(sm => {
      const ruleNames = [];
      const oldRuleNames = [];
      sm.rules.forEach(ruleName => {
        const rule = _.find(latestRules, {oldName: ruleName});
        if (!rule) {
          throw new Error(`submeasure rule lookup: rule not found for ruleName: ${ruleName}`);
        }
        ruleNames.push(rule.name);
        oldRuleNames.push(ruleName);
      });
      sm.rules = ruleNames;
      sm.oldRules = oldRuleNames;
    });

    latestSms.forEach(sm => {
      smBuf.push(smProps.map(prop => {
        if (_.isArray(sm[prop]) && sm[prop].length) {
          return `${_.get(sm, prop).join('/')}`;
        } else {
          return _.get(sm, prop);
        }
      }).toString());
    })

    const smFileName = 'submeasure-rule-change.csv';
    fs.writeFileSync(smFileName, smBuf.join('\n'));
    console.log(`${latestSms.length} submeasures processed to /dist/sandbox/${smFileName}`);


    //////// update database
    Promise.all([
      ruleRepo.removeMany({}),
      smRepo.removeMany({})
    ])
      .then(() => {
        return Promise.all([
          ruleRepo.addMany(latestRules, 'system', true, true),
          smRepo.addMany(latestSms, 'system', true, true)
        ])
          .then(() => {
            console.log(`${latestRules.length} rules updated in database`);
            console.log(`${latestSms.length} submeasures updated in database`);
            process.exit(0);
          });
      });



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

    // need to look for duplicates too, but your output would show that right? Sort by newname then?

  })

/*
  sl1Select?: string;
  sl2Select?: string;
  sl3Select?: string;
  prodTGSelect?: string;
  prodBUSelect?: string;
  prodPFSelect?: string;
  scmsSelect?: string;
  beSelect?: string;
 */

function addDescription(rule, driver, period) {
  let desc = `Name:  ${rule.name}`;
  desc += rule.oldName ? `\nOld Name:  ${rule.oldName}` : '';
  desc += `\nDriver:  ${driver.name}`;
  desc += `\nPeriod:  ${period.period}`;

  desc += rule.salesMatch ? `\nSales:  ${rule.salesMatch}` : '';
  desc += rule.productMatch ? `\nProduct:  ${rule.productMatch}` : '';
  desc += rule.scmsMatch ? `\nSCMS:  ${rule.scmsMatch}` : '';
  desc += rule.beMatch ? `\nInternal Business Entity:  ${rule.beMatch}` : '';
  desc += rule.legalEntityMatch ? `\nLegal Entity:  ${rule.legalEntityMatch}` : '';
  desc += rule.countryMatch ? `\nCountry:  ${rule.countryMatch}` : '';
  desc += rule.extTheaterMatch ? `\nExternal Theater:  ${rule.extTheaterMatch}` : '';
  desc += rule.glSegmentsMatch && rule.glSegmentsMatch.length ? `\nGL Segments:  ${rule.glSegmentsMatch}` : '';

  desc += rule.sl1Select ? `\nSL1 Select:  ${rule.sl1Select}` : '';
  desc += rule.sl2Select ? `\nSL2 Select:  ${rule.sl2Select}` : '';
  desc += rule.sl3Select ? `\nSL3 Select:  ${rule.sl3Select}` : '';
  desc += rule.prodTGSelect ? `\nTG Select:  ${rule.prodTGSelect}` : '';
  desc += rule.prodBUSelect ? `\nBU Select:  ${rule.prodBUSelect}` : '';
  desc += rule.prodPFSelect ? `\nPF Select:  ${rule.prodPFSelect}` : '';
  desc += rule.scmsSelect ? `\nSCMS Select:  ${rule.scmsSelect}` : '';
  desc += rule.beSelect ? `\nIBE Select:  ${rule.beSelect}` : '';
  rule.descO = `"${desc}"`;
  rule.desc = desc;
}

function quoteSelectText(rule) {
  rule.sl1SelectQ = `"${rule.sl1Select}"`;
  rule.sl2SelectQ = `"${rule.sl2Select}"`;
  rule.sl3SelectQ = `"${rule.sl3Select}"`;
  rule.prodTGSelectQ = `"${rule.prodTGSelect}"`;
  rule.prodBUSelectQ = `"${rule.prodBUSelect}"`;
  rule.prodPFSelectQ = `"${rule.prodPFSelect}"`;
  rule.scmsSelectQ = `"${rule.scmsSelect}"`;
  rule.beSelectQ = `"${rule.beSelect}"`;
}

function addDuplicate(rules) {
  const duplicates = [];
  rules.forEach(rule => {
    const entry = _.find(duplicates, {name: rule.name});
    if (entry) {
      entry.count++;
    } else {
      duplicates.push({name: rule.name, count: 1});
    }
  });
  rules.forEach(rule => rule.duplicates = _.find(duplicates, {name: rule.name}).count);
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
const beMatches = [{match: 'BE', abbrev: 'IBE'}, {match: 'Sub BE', abbrev: 'ISBE'}];
const countryMatches = [{name: 'Sales Country Name', value: 'sales_country_name', abbrev: 'CNT'}];
const extTheaterMatches = [{name: 'External Theater Name', value: 'ext_theater_name', abbrev: 'EXTTH'}];
const glSegmentsMatches = [{name: 'Account', value: 'ACCOUNT', abbrev: 'ACT'}, {name: 'Sub Account', value: 'SUB ACCOUNT', abbrev: 'SUBACT'},
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
    rule.name += `-${str}`;
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
  const ibe = selectMap.getSelectString('ibe', rule.beCritCond, rule.beCritChoices);
  str += sl1 ? `-${sl1}` : '';
  str += sl2 ? `-${sl2}` : '';
  str += sl3 ? `-${sl3}` : '';
  str += tg ? `-${tg}` : '';
  str += bu ? `-${bu}` : '';
  str += pf ? `-${pf}` : '';
  str += scms ? `-${scms}` : '';
  str += ibe ? `-${ibe}` : '';
  if (str) {
    rule.name += str;
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
