import {injector} from '../server/lib/common/inversify.config';
const inj = injector; // required to import reflect-metadata before any injection
import {mgc} from '../server/lib/database/mongoose-conn';
import AllocationRuleRepo from '../server/api/common/allocation-rule/repo';
import AnyObj from '../shared/models/any-obj';
import * as fs from 'fs';
import * as _ from 'lodash';
import LookupRepo from '../server/api/lookup/repo';
import SubmeasureRepo from '../server/api/common/submeasure/repo';
import {SelectExceptionMap} from '../shared/classes/select-exception-map';
import {ruleUtil} from '../shared/misc/rule-util';

const ruleRepo = new AllocationRuleRepo();
const smRepo = new SubmeasureRepo();
const lookupRepo = new LookupRepo();
let drivers, periods;
/*
get A/I >> get new name >> update all with that name to new name... done
 */

const selectMap = new SelectExceptionMap();
const ruleBuf = [];
const ruleHeader = ['Status', 'Old Name', 'New Name', 'Duplicates', 'Description', 'Driver Name', 'Driver Period', 'Sales Match', 'Product Match', 'SCMS Match', 'IBE Match', 'Legal Entity Match', 'Country', 'External Theater', 'GL Segments',
  'SL1 Select', 'SL2 Select', 'SL3 Select', 'TG Select', 'BU Select', 'PF Select', 'SCMS Select', 'IBE Select', 'Created By', 'Created Date', 'Updated By', 'UpdatedDate'];
const ruleProps =       ['status', 'oldName', 'name', 'duplicates', 'descQ', 'driverName', 'period', 'salesMatch', 'productMatch', 'scmsMatch', 'beMatch', 'legalEntityMatch', 'countryMatch', 'extTheaterMatch', 'glSegmentsMatch',
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
      // fix ram's bad imports on approvedOnce and glSegmentsMatch
      rule.approvedOnce = 'Y';
      rule.glSegmentsMatch = rule.glSegmentsMatch || [];

      ruleUtil.createSelectArrays(rule);
      rule.oldName = rule.name;
      ruleUtil.addRuleNameAndDescription(rule, selectMap, drivers, periods);
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

    fs.writeFileSync('select-map.json', JSON.stringify(selectMap, null, 2));

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


