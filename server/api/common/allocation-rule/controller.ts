import AllocationRuleRepo from './repo';
import {injectable} from 'inversify';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode} from '../../../../shared/misc/enums';
import LookupRepo from '../../lookup/repo';
import {svrUtil} from '../../../lib/common/svr-util';
import {shUtil} from '../../../../shared/misc/shared-util';
import _ from 'lodash';
import AnyObj from '../../../../shared/models/any-obj';
import {ruleUtil} from '../../../../shared/misc/rule-util';
import {SelectExceptionMap} from '../../../../shared/classes/select-exception-map';

@injectable()
export default class AllocationRuleController extends ApprovalController {
  constructor(repo: AllocationRuleRepo, private lookupRepo: LookupRepo, private pgLookupRepo: PgLookupRepo) {
    super(repo);
  }

  saveToDraft(req, res, next) {
    super.saveToDraft(req, res, next);
  }

  submitForApproval(req, res, next) {
    this.validateChoices(req.body)
      .then(() => super.submitForApproval(req, res, next))
      .catch(next);
  }


  validateChoices(rule) {
    return Promise.all([
      this._validateSalesSL2CritChoices(ruleUtil.parseSelect(rule.sl2Select)),
      this._validateSalesSL3CritChoices(ruleUtil.parseSelect(rule.sl3Select)),
      this._validateProdPFCritChoices(ruleUtil.parseSelect(rule.prodPFSelect)),
      this._validateProdBUCritChoices(ruleUtil.parseSelect(rule.prodBUSelect))
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
        throw new ApiError('Add rule errors.', errs, 400);
      }
    });
  }

  _validateSalesSL2CritChoices(choices): Promise<{values: any[], exist: boolean}> {
    if (!choices.length) {
      return Promise.resolve({values: [], exist: true});
    }
    return this.pgLookupRepo.checkForExistenceArray('fpacon.vw_fpa_sales_hierarchy',
      'l2_sales_territory_name_code', choices, true);
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
      'l3_sales_territory_name_code', choices, true);
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
      'scmsCritCond', 'scmsCritChoices', 'beCritCond', 'beCritChoices', 'approvalUrl', 'approvalReminderTime'
    ];
    return this.sendApprovalEmailBase(req, mode, item, 'rule', omitProperties);
  }

  approveValidate(approvalItems, req, next) {
    return super.approveValidate(approvalItems, req, next)
      .then(aiItems => {
        return this.repo.getManyLatestGroupByNameActiveInactiveConcatDraftPending(req.dfa.moduleId)
          .then(aidpItems => {
            aidpItems.forEach(rule => ruleUtil.createSelectArrays(rule));
            const selectMap = new SelectExceptionMap();
            // this will crash if there are any clashes in exceptions. This should never happen, but we need to know if it does and this
            // and the rule edit page are both good places to verify.
            selectMap.parseRules(aidpItems);
          })
          // needed to catch selectMap errors
          .catch(next);
      });
  }

}

