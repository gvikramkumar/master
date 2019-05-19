import AnyObj from '../models/any-obj';
import _ from 'lodash';


export const ruleUtil = {
  createSelectArrays,
  parseSelect,
  createSelect,
  addRuleNameAndDescription,
};

function addRuleNameAndDescription(rule, selectMap, drivers, periods) {
  const driver = _.find(drivers, {value: rule.driverName});
  if (!driver) {
    throw new Error(`Missing driver: ${rule.driverName}`);
  }
  const period = _.find(periods, {period: rule.period});
  if (!period) {
    throw new Error(`Missing period: ${rule.period}`);
  }

  rule.name = `${driver.abbrev || driver.value}-${period.abbrev || period.period}`;
  addMatches(rule);
  addSelects(rule, selectMap);
  addDescription(rule, driver, period);
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
  if (!_.isArray(rule.glSegmentsMatch)) {
    throw Error(`glSegmentsMatch is not an array: ${rule.oldName}`);
  }
  str += rule.glSegmentsMatch.length ? getMatchTextArray(glSegmentsMatches, 'value', rule.glSegmentsMatch) : '';

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
  rule.descQ = `"${desc}"`;
  rule.desc = desc;
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

function createSelect(cond, _choices) {
  const choices = _.uniq(_choices);
  let sql = ` ${cond} ( `;
  choices.forEach((choice, idx) => {
    sql += `'${choice.trim()}'`;
    if (idx < choices.length - 1) {
      sql += ', ';
    }
  });
  sql += ` ) `;
  return sql;
}

