import AllocationRuleRepo from './repo';
import {injectable} from 'inversify';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode} from '../../../../shared/enums';
import {sendHtmlMail} from '../../../lib/common/mail';
import LookupRepo from '../../lookup/repo';
import {svrUtil} from '../../../lib/common/svr-util';
import {shUtil} from '../../../../shared/shared-util';
import * as _ from 'lodash';

@injectable()
export default class AllocationRuleController extends ApprovalController {
  constructor(repo: AllocationRuleRepo, private lookupRepo: LookupRepo, private pgLookupRepo: PgLookupRepo) {
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

  submitForApproval(req, res, next) {
    this.validateConditionalsAndUpdateSelects(req.body)
      .then(() => super.submitForApproval(req, res, next))
      .catch(next);
  }

  approve(req, res, next) {
    this.validateConditionalsAndUpdateSelects(req.body)
      .then(() => super.approve(req, res, next))
      .catch(next);
  }

  validateConditionalsAndUpdateSelects(rule) {
    if (rule.salesSL1CritCond && rule.salesSL1CritChoices.length) {
      rule.sl1Select = this.createSelect(rule.salesSL1CritCond, rule.salesSL1CritChoices);
    } else {
      rule.sl1Select = undefined;
    }

    if (rule.salesSL2CritCond && rule.salesSL2CritChoices.length) {
      rule.sl2Select = this.createSelect(rule.salesSL2CritCond, rule.salesSL2CritChoices);
    } else {
      rule.sl2Select = undefined;
    }

    if (rule.salesSL3CritCond && rule.salesSL3CritChoices.length) {
      rule.sl3Select = this.createSelect(rule.salesSL3CritCond, rule.salesSL3CritChoices);
    } else {
      rule.sl3Select = undefined;
    }

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

    if (rule.scmsCritCond && rule.scmsCritChoices.length) {
      rule.scmsSelect = this.createSelect(rule.scmsCritCond, rule.scmsCritChoices);
    } else {
      rule.scmsSelect = undefined;
    }

    if (rule.beCritCond && rule.beCritChoices.length) {
      rule.beSelect = this.createSelect(rule.beCritCond, rule.beCritChoices);
    } else {
      rule.beSelect = undefined;
    }

    return Promise.all([
      this._validateSalesSL2CritChoices(rule.salesSL2CritChoices),
      this._validateSalesSL3CritChoices(rule.salesSL3CritChoices),
      this._validateProdPFCritChoices(rule.prodPFCritChoices),
      this._validateProdBUCritChoices(rule.prodBUCritChoices)
    ]).then(results => {
      const errors = [
        {message: 'Some sales SL2 select fields don\'t exist.'},
        {message: 'Some sales SL3 select fields don\'t exist.'},
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
        throw new ApiError('Add rule errors', errs, 400);
      }
    });
  }

  _validateSalesSL2CritChoices(choices): Promise<{values: any[], exist: boolean}> {
    if (!choices.length) {
      return Promise.resolve({values: [], exist: true});
    }
    return this.pgLookupRepo.checkForExistenceArray('fpacon.vw_fpa_sales_hierarchy',
      'l2_sales_territory_descr', choices, true);
  }

  validateSalesSL2CritChoices(req, res, next) {
    this._validateSalesSL2CritChoices(req.body)
      .then(results => res.json(results))
      .catch(next);
  }

  _validateSalesSL3CritChoices(choices): Promise<{values: any[], exist: boolean}> {
    if (!choices.length) {
      return Promise.resolve({values: [], exist: true});
    }
    return this.pgLookupRepo.checkForExistenceArray('fpacon.vw_fpa_sales_hierarchy',
      'l3_sales_territory_descr', choices, true);
  }

  validateSalesSL3CritChoices(req, res, next) {
    this._validateSalesSL3CritChoices(req.body)
      .then(results => res.json(results))
      .catch(next);
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


  sendApprovalEmail(req, mode: ApprovalMode, item): Promise<any> {
    const omitProperties = ['_id', 'id', '__v', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate', 'approvedOnce',
      'salesSL1CritCond', 'salesSL1CritChoices', 'salesSL2CritCond', 'salesSL2CritChoices', 'salesSL3CritCond', 'salesSL3CritChoices',
      'prodPFCritCond', 'prodPFCritChoices', 'prodBUCritCond', 'prodBUCritChoices', 'prodTGCritCond', 'prodTGCritChoices',
      'scmsCritCond', 'scmsCritChoices', 'beCritCond', 'beCritChoices'
    ];
    return this.sendApprovalEmailBase(req, mode, item, 'rule', 'rule-management', omitProperties);
  }

}

