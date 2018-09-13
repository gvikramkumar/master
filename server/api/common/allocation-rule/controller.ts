import AllocationRuleRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {injectable} from 'inversify';
import {AllocationRule} from '../../../../shared/models/allocation-rule';
import PgLookupRepo from '../pg-lookup/repo';
import {svrUtil} from '../../../lib/common/svr-util';
import {ApiError} from '../../../lib/common/api-error';
import ApprovalController from '../../../lib/base-classes/approval-controller';

@injectable()
export default class AllocationRuleController extends ApprovalController {
  constructor(repo: AllocationRuleRepo, private pgLookupRepo: PgLookupRepo) {
    super(repo);
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

    Promise.all([
      this.validateNameDoesntExist(rule.name, true, rule.moduleId),
      this._validateProdPFCritChoices(rule.prodPFCritChoices),
      this._validateProdBUCritChoices(rule.prodBUCritChoices)
    ]).then(results => {
      const errors = [
        {message: 'Name already exists'},
        {message: 'Some product PF select fields don\'t exist.'},
        {message: 'Some product BU select fields don\'t exist.'}
      ];
      const errs = [];
      results.map(x => x.values ? x.exist : x)
        .forEach((valid, idx) => {
        if (valid === false) {
          errs.push(errors[idx]);
        }
      });
      if (errs.length) {
        next(new ApiError('Add rule errors', errs, 400));
        return;
      }
      super.addOne(req, res, next);
    });
  }


  _validateProdPFCritChoices(choices): Promise<{values: any[], exist: boolean}> {
    if (!choices.length) {
      return Promise.resolve({values: [], exist: true});
    }
    return this.pgLookupRepo.checkForExistenceArray('fpacon.vw_fpa_products',
      'product_family_id', choices, true);
  }

  validateProdPFCritChoices(req, res, next) {
    this._validateProdPFCritChoices(req.body)
      .then(results => res.json(results))
      .catch(next);
  }

  _validateProdBUCritChoices(choices): Promise<{values: any[], exist: boolean}> {
    if (!choices.length) {
      return Promise.resolve({values: [], exist: true});
    }
    return this.pgLookupRepo.checkForExistenceArray('fpacon.vw_fpa_products',
      'business_unit_id', choices, true);
  }

  validateProdBUCritChoices(req, res, next) {
    this._validateProdBUCritChoices(req.body)
      .then(results => res.json(results))
      .catch(next);
  }


}

