import AllocationRuleRepo from './repo';
import {injectable} from 'inversify';
import PgLookupRepo from '../pg-lookup/repo';
import {ApiError} from '../../../lib/common/api-error';
import ApprovalController from '../../../lib/base-classes/approval-controller';
import {ApprovalMode} from '../../../../shared/enums';
import {sendHtmlMail} from '../../../lib/common/mail';
import LookupRepo from '../lookup/repo';
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

    return Promise.all([
      this._validateProdPFCritChoices(rule.prodPFCritChoices),
      this._validateProdBUCritChoices(rule.prodBUCritChoices)
    ]).then(results => {
      const errors = [
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

  sendApprovalEmail(req, mode: ApprovalMode, rule): Promise<any> {
    this.verifyProperties(req.query, ['moduleId']);
    const data = req.body;
    const moduleId = req.dfa.moduleId;
    const url = `${req.headers.origin}/prof/rule-management/edit/${rule.id};mode=view`;
    const link = `<a href="${url}">${url}</a>`;
    let body;
    const adminEmail = svrUtil.getAdminEmail(req.dfa);
    const promises = [];
    if (mode === ApprovalMode.submit && data.approvedOnce === 'Y') {
      promises.push(this.repo.getOneLatest({moduleId, name: data.name, approvedOnce: 'Y', status: {$in: ['A', 'I']}}));
    }
    return Promise.all(promises)
      .then(results => {
        switch (mode) {
          case ApprovalMode.submit:
            if (data.approvedOnce === 'Y') {
              body = `The "${data.name}" DFA rule has been updated and submitted by ${req.user.fullName} for approval: <br><br>${link}`;
              const oldObj = results[0];
              if (oldObj) {
                if (rule.toObject) {
                  rule = rule.toObject();
                }
                const omitProperties = ['_id', 'id', 'status', 'createdBy', 'createdDate', 'updatedBy', 'updatedDate', '__v', 'approvedOnce',
                  'salesCritCond', 'salesCritChoices',
                  'prodPFCritCond', 'prodPFCritChoices', 'prodBUCritCond', 'prodBUCritChoices', 'prodTGCritCond', 'prodTGCritChoices',
                  'scmsCritCond', 'scmsCritChoices', 'beCritCond', 'beCritChoices'
                ];
                body += '<br><br><b>Summary of changes:</b><br><br>' +
                  shUtil.getUpdateTable(shUtil.getObjectChanges(oldObj.toObject(), rule, omitProperties));
              }
            } else {
              body = `A new DFA rule has been submitted by ${req.user.fullName} for approval: <br><br>${link}`;
            }
            return sendHtmlMail(req.user.email, adminEmail, svrUtil.getItadminEmail(req.dfa),
              `DFA - ${_.find(req.dfa.modules, {moduleId}).name} - Rule Submitted for Approval`, body);
          case ApprovalMode.approve:
            body = `The DFA rule submitted by ${req.user.fullName} for approval has been approved:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage.replace('\n', '<br>')}`;
            }
            return sendHtmlMail(adminEmail, req.user.email, svrUtil.getItadminEmail(req.dfa),
              `DFA - ${_.find(req.dfa.modules, {moduleId}).name} - Rule Approved`, body);
          case ApprovalMode.reject:
            body = `The DFA rule submitted by ${req.user.fullName} for approval has been rejected:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage.replace('\n', '<br>')}`;
            }
            return sendHtmlMail(adminEmail, req.user.email, svrUtil.getItadminEmail(req.dfa),
              `DFA - ${_.find(req.dfa.modules, {moduleId}).name} - Rule Not Approved`, body);
        }
      });

  }

}

