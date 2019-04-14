import {injector} from '../server/lib/common/inversify.config';
const inj = injector; // required to import reflect-metadata before any injection
import AllocationRuleRepo from '../server/api/common/allocation-rule/repo';
import {shUtil} from '../shared/shared-util';



/*
rule name gen duplicates
REVPOS-SL1CNTEXTTH-NOWWDISTI-NOSCMS-MTD
REVPOS-SL1EXTTH-NOWWDISTI-NOSCMS-MTD
REVPOS-SL1-NOWWDISTI-NOSCMS-MTD

 */

const repo = new AllocationRuleRepo()

repo.getMany({moduleId: 1, name: {$in: [
  'REVPOS-SL1CNTEXTTH-NOWWDISTI-NOSCMS-MTD',
      'REVPOS-SL1EXTTH-NOWWDISTI-NOSCMS-MTD',
      'REVPOS-SL1-NOWWDISTI-NOSCMS-MTD']}})
  .then(rules => {
    rules.forEach(_rule1 => {
      const rule1 = _rule1.toObject();
      console.log();
      rules.forEach(_rule2 => {
        const rule2 = _rule2.toObject();
        if (_rule1 !== _rule2) {
          const changes = shUtil.getObjectChanges(rule1, rule2, ['name', 'oldName', 'id']);
          if (changes.length) {
            console.log (rule1.name, ' >>>> ', rule2.name, changes);
          } else {
            console.log (rule1.name, ' >>>> ', rule2.name, 'equal');
          }
        }
      });
    });
  })

