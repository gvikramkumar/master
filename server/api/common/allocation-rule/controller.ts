import AllocationRuleRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {injectable} from 'inversify';
import {AllocationRule} from '../../../../shared/models/allocation-rule';
import PostgresRepo from '../pg-lookup/postgres-repo';
import {svrUtil} from '../../../lib/common/svr-util';
import {ApiError} from '../../../lib/common/api-error';

@injectable()
export default class AllocationRuleController extends ControllerBase {
  constructor(repo: AllocationRuleRepo, private postgresRepo: PostgresRepo) {
    super(repo);
  }

  // we need to generate the sql statements from their condition and choices, and for
  // some we need to validate their choices against postgres
  addOne(req, res, next) {
    const rule: AllocationRule = req.body;
    if (rule.salesMatch && rule.salesCritCond && rule.salesCritChoices.length) {
      rule.sl1Select = this.createSelect(rule.salesCritCond, rule.salesCritChoices);
    } else {
      rule.sl1Select = undefined;
    }

    if (rule.productMatch) {
      if (rule.prodPFCritCond && rule.prodPFCritChoices.length) {
        rule.prodPFSelect = this.createSelect(rule.prodPFCritCond, rule.prodPFCritChoices);
      } else {
        rule.prodPFSelect = undefined;
      }
      if (rule.prodBUCritCond && rule.prodBUCritChoices.length) {
        // validate BU choices and gen sql
        rule.prodBUSelect = this.createSelect(rule.prodBUCritCond, rule.prodBUCritChoices);
      } else {
        rule.prodBUSelect = undefined;
      }
      if (rule.prodTGCritCond && rule.prodTGCritChoices.length) {
        rule.prodTGSelect = this.createSelect(rule.prodTGCritCond, rule.prodTGCritChoices);
      } else {
        rule.prodTGSelect = undefined;
      }
    }

    if (rule.scmsMatch && rule.scmsCritCond && rule.scmsCritChoices.length) {
      rule.scmsSelect = this.createSelect(rule.scmsCritCond, rule.scmsCritChoices);
    } else {
      rule.scmsSelect = undefined;
    }

    if (rule.beMatch && rule.beCritCond && rule.beCritChoices.length) {
      rule.beSelect = this.createSelect(rule.beCritCond, rule.beCritChoices);
    } else {
      rule.beSelect = undefined;
    }

    const promises = [];
    const validations: {name: string, values: string[]}[] = <any>[];
    
    if (rule.prodPFSelect) {
      promises.push(this.postgresRepo.getSortedListFromColumn('fpacon.vw_fpa_products', 'product_family_id'));
      validations.push({name: 'Product PF', values: rule.prodPFCritChoices});
    }
    if (rule.prodBUSelect) {
      promises.push(this.postgresRepo.getSortedListFromColumn('fpacon.vw_fpa_products', 'business_unit_id'));
      validations.push({name: 'Product BU', values: rule.prodBUCritChoices});
    }

    req.body = rule;
    if (promises.length) {
      const errors = [];
      Promise.all(promises)
        .then(results => {
          validations.forEach((validation, valIdx) => {
            validation.values.forEach(uiValue => {
                if (svrUtil.sortedListNotExists(results[valIdx], uiValue)) {
                errors.push(`${uiValue} is invalid for ${validation.name}`);
              }
            });
          });
          if (errors.length) {
            next(new ApiError('Invalid values', errors, 400));
          } else {
            super.addOne(req, res, next);
          }
        });
    } else {
      super.addOne(req, res, next);
    }
  }

  createSelect(cond, choices) {
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

}

