import {injector} from '../server/lib/common/inversify.config';
const inj = injector; // required to import reflect-metadata before any injection
import AllocationRuleRepo from '../server/api/common/allocation-rule/repo';
import {ruleUtil} from '../shared/misc/rule-util';

const ruleRepo = new AllocationRuleRepo();

ruleRepo.getManyLatestGroupByNameActiveInactive(1)
  .then(rules => {
    rules.forEach(rule => {
      ruleUtil.createSelectArrays(rule);
      updateSelectStatements(rule);
      updateMatches(rule);
    });
    const promises = [];
    rules.forEach(rule => {
      promises.push(ruleRepo.update(rule, rule.updatedBy, false, true, false));
    });
    Promise.all(promises)
      .then(results => console.log('done'));

  });

function updateMatches(rule) {
  if (rule.salesMatch === '' || (rule.salesMatch && rule.salesMatch.trim().length === 0)) {
    delete rule.salesMatch;
  }
  if (rule.productMatch === '' || (rule.productMatch && rule.productMatch.trim().length === 0)) {
    delete rule.productMatch;
  }
  if (rule.scmsMatch === '' || (rule.scmsMatch && rule.scmsMatch.trim().length === 0)) {
    delete rule.scmsMatch;
  }
  if (rule.legalEntityMatch === '' || (rule.legalEntityMatch && rule.legalEntityMatch.trim().length === 0)) {
    delete rule.legalEntityMatch;
  }
  if (rule.beMatch === '' || (rule.beMatch && rule.beMatch.trim().length === 0)) {
    delete rule.beMatch;
  }
  if (rule.countryMatch === '' || (rule.countryMatch && rule.countryMatch.trim().length === 0)) {
    delete rule.countryMatch;
  }
  if (rule.extTheaterMatch === '' || (rule.extTheaterMatch && rule.extTheaterMatch.trim().length === 0)) {
    delete rule.extTheaterMatch;
  }
}

function updateSelectStatements(rule) {
  if (rule.salesSL1CritCond && rule.salesSL1CritChoices.length) {
    rule.sl1Select = ruleUtil.createSelect(rule.salesSL1CritCond, rule.salesSL1CritChoices);
  } else {
    rule.sl1Select = undefined;
  }

  if (rule.salesSL2CritCond && rule.salesSL2CritChoices.length) {
    rule.sl2Select = ruleUtil.createSelect(rule.salesSL2CritCond, rule.salesSL2CritChoices);
  } else {
    rule.sl2Select = undefined;
  }

  if (rule.salesSL3CritCond && rule.salesSL3CritChoices.length) {
    rule.sl3Select = ruleUtil.createSelect(rule.salesSL3CritCond, rule.salesSL3CritChoices);
  } else {
    rule.sl3Select = undefined;
  }

  // Input Crititira selections
  if (rule.salesSL1IpCritCond && rule.salesSL1IpCritChoices.length) {
    rule.sl1IpCond = ruleUtil.createSelect(rule.salesSL1IpCritCond, rule.salesSL1IpCritChoices);
  } else {
    rule.sl1IpCond = undefined;
  }

  if (rule.salesSL2IpCritCond && rule.salesSL2IpCritChoices.length) {
    rule.sl2IpCond = ruleUtil.createSelect(rule.salesSL2IpCritCond, rule.salesSL2IpCritChoices);
  } else {
    rule.sl2IpCond = undefined;
  }

  if (rule.salesSL3IpCritCond && rule.salesSL3IpCritChoices.length) {
    rule.sl3IpCond = ruleUtil.createSelect(rule.salesSL3IpCritCond, rule.salesSL3IpCritChoices);
  } else {
    rule.sl3IpCond = undefined;
  }

  if (rule.prodPFCritCond && rule.prodPFCritChoices.length) {
    rule.prodPFSelect = ruleUtil.createSelect(rule.prodPFCritCond, rule.prodPFCritChoices);
  } else {
    rule.prodPFSelect = undefined;
  }
  if (rule.prodBUCritCond && rule.prodBUCritChoices.length) {
    // validate BU choices and gen sql
    rule.prodBUSelect = ruleUtil.createSelect(rule.prodBUCritCond, rule.prodBUCritChoices);
  } else {
    rule.prodBUSelect = undefined;
  }
  if (rule.prodTGCritCond && rule.prodTGCritChoices.length) {
    rule.prodTGSelect = ruleUtil.createSelect(rule.prodTGCritCond, rule.prodTGCritChoices);
  } else {
    rule.prodTGSelect = undefined;
  }

  if (rule.prodTGIpCritCond && rule.prodTGIpCritChoices.length) {
    rule.prodTGIpSelect = ruleUtil.createSelect(rule.prodTGIpCritCond, rule.prodTGIpCritChoices);
  } else {
    rule.prodTGIpSelect = undefined;
  }

  if (rule.scmsCritCond && rule.scmsCritChoices.length) {
    rule.scmsSelect = ruleUtil.createSelect(rule.scmsCritCond, rule.scmsCritChoices);
  } else {
    rule.scmsSelect = undefined;
  }

  if (rule.scmsIpCritCond && rule.scmsIpCritChoices.length) {
    rule.scmsIpSelect = ruleUtil.createSelect(rule.scmsIpCritCond, rule.scmsIpCritChoices);
  } else {
    rule.scmsIpSelect = undefined;
  }

  if (rule.beCritCond && rule.beCritChoices.length) {
    rule.beSelect = ruleUtil.createSelect(rule.beCritCond, rule.beCritChoices);
  } else {
    rule.beSelect = undefined;
  }

  if (rule.beIpCritCond && rule.beIpCritChoices.length) {
    rule.beIpSelect = ruleUtil.createSelect(rule.beIpCritCond, rule.beIpCritChoices);
  } else {
    rule.beIpSelect = undefined;
  }

  if (rule.countryIpCritCond && rule.countryIpCritChoices.length) {
    rule.countryIpSelect = ruleUtil.createSelect(rule.countryIpCritCond, rule.countryIpCritChoices);
  } else {
    rule.countryIpSelect = undefined;
  }

  if (rule.externalTheaterIpCritCond && rule.externalTheaterIpCritChoices.length) {
    rule.externalTheaterIpSelect = ruleUtil.createSelect(rule.externalTheaterIpCritCond, rule.externalTheaterIpCritChoices);
  } else {
    rule.externalTheaterIpSelect = undefined;
  }

}
