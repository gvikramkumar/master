import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import {ApprovalMode} from '../../../shared/misc/enums';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import {shUtil} from '../../../shared/misc/shared-util';
import {sendHtmlMail} from '../common/mail';
import AnyObj from '../../../shared/models/any-obj';

export default class ApprovalController extends ControllerBase {

  constructor(
    protected repo: RepoBase
    ) {
    super(repo);
  }

  saveToDraft(req, res, next) {
    req.body.status = 'D';
    this.verifyProperties(req.query, ['saveMode']);
    const saveMode = req.query.saveMode;
    if (saveMode === 'add') {
      this.addOneNoValidate(req, res, next);
    } else if (saveMode === 'copy') {
      this.copyOneNoValidate(req, res, next);
    } else if (saveMode === 'update') {
      this.updateOneNoValidate(req, res, next);
    }
  }

  submitForApproval(req, res, next) {
    const data = req.body;
    this.verifyProperties(req.query, ['saveMode']);
    const saveMode = req.query.saveMode;
    data.status = 'P';
    let promise;
    if (saveMode === 'add') {
      promise = this.addOnePromise(req, res, next);
    } else if (saveMode === 'copy') {
      promise = this.copyOnePromise(req, res, next);
    } else if (saveMode === 'update') {
      promise = this.updatePromise(req, res, next);
    }
    promise
      .then(item => {
        return this.sendApprovalEmail(req, ApprovalMode.submit, item)
          .then(() => res.json(item));
      })
      .catch(next);
  }

  approve(req, res, next) {
    const data = req.body;
    this.repo.validate(data);
    let firstTimeApprove = false;
    if (data.approvedOnce === 'Y') {
      data.status = data.activeStatus;
      data.approvedBy = req.user.id;
      data.approvedDate = new Date();
    } else if (data.approvedOnce === 'N' && data.status === 'P') {
      firstTimeApprove = true;
      data.status = 'A';
      data.activeStatus = 'A';
      data.approvedOnce = 'Y';
      data.approvedBy = req.user.id;
      data.approvedDate = new Date();
    }
    this.preApproveStep(data, firstTimeApprove, req)
      .then(() => {
      this.repo.update(data, req.user.id, true, true, false)
        .then(item => {
          return this.postApproveStep(data, req)
            .then(() => item);
        })
        .then(item => {
          return this.sendApprovalEmail(req, ApprovalMode.approve, item)
            .then(() => res.json(item));
        });
    })
      .catch(next);
  }

  reject(req, res, next) {
    const data = req.body;
    req.body.status = 'D';
    this.preRejectStep(data, req)
      .then(() => {
        this.updateOneNoValidatePromise(data, req.user.id, false)
          .then(item => {
            return this.sendApprovalEmail(req, ApprovalMode.reject, item)
              .then(() => res.json(item));
          });
      });
  }

  activate(req, res, next) {
    req.body.status = 'A';
    this.update(req, res, next);
  }

  inactivate(req, res, next) {
    req.body.status = 'I';
    this.updateOneNoValidate(req, res, next);
  }

  getManyLatestGroupByNameActive(req, res, next) {
    this.repo.getManyLatestGroupByNameActive(Number(req.query.moduleId) || req.body.moduleId)
      .then(docs => res.send(docs))
      .catch(next);
  }

  getManyLatestGroupByNameActiveInactive(req, res, next) {
    this.repo.getManyLatestGroupByNameActiveInactive(req.body.moduleId)
      .then(docs => res.send(docs))
      .catch(next);
  }

  getManyLatestGroupByNameActiveInactiveConcatDraftPendingOfUser(req, res, next) {
    return Promise.all([
      this.repo.getManyLatestGroupByNameActiveInactive(req.body.moduleId),
      this.repo.getMany({
        status: {$in: ['D', 'P']},
        createdBy: req.user.id,
        moduleId: req.body.moduleId})
    ])
      .then(results => {
        const ailist: any = results[0];
        const draftPending = results[1];
        res.json(ailist.concat(draftPending));
      })
      .catch(next);
  }

  getManyLatestGroupByNameActiveInactiveConcatDraftPending(req, res, next) {
    return Promise.all([
      this.repo.getManyLatestGroupByNameActiveInactive(req.body.moduleId),
      this.repo.getMany({
        status: {$in: ['D', 'P']},
        moduleId: req.body.moduleId})
    ])
      .then(results => {
        const ailist: any = results[0];
        const draftPending = results[1];
        res.json(ailist.concat(draftPending));
      })
      .catch(next);
  }

  // this step can modify the data, as it's pre-save
  preApproveStep(data, firstTimeApprove, req) {
    return Promise.resolve();
  }

  // this "doesn't" modify data as it's already saved
  postApproveStep(data, req) {
    return Promise.resolve();
  }

  // this step can modify the item, so any overrides are responsible for returning the passed item
  preRejectStep(data, req) {
    return Promise.resolve(data);
  }

  sendApprovalEmail(req, mode: ApprovalMode, item: AnyObj): Promise<any> {
    throw new ApiError(`sendApprovalEmail not implemented`);
  }

  sendApprovalEmailBase(req, mode: ApprovalMode, item: AnyObj, type: string, endpoint: string, omitProperties): Promise<any> {
    const data = req.body;
    const moduleId = req.dfa.moduleId;
    const url = `${req.headers.origin}/prof/${endpoint}/edit/${item.id};mode=view`;
    const link = `<a href="${url}">${url}</a>`;
    let body;
    const itadminEmail = svrUtil.getItadminEmail(req.dfa);
    const dfaAdminEmail = svrUtil.getDfaAdminEmail(req.dfa);
    const bizAdminEmail = svrUtil.getBizAdminEmail(req.dfa);
    const ppmtEmail = svrUtil.getPpmtEmail(req.dfa);
    const promises = [];
    if (mode === ApprovalMode.submit && data.approvedOnce === 'Y') {
      promises.push(this.repo.getOneLatestActiveInactive({moduleId, name: data.name, approvedOnce: 'Y'}));
    }
    return Promise.all(promises)
      .then(results => {
        switch (mode) {
          case ApprovalMode.submit:
            if (data.approvedOnce === 'Y') {
              body = `The "${data.name}" DFA ${type} has been updated and submitted by ${req.user.fullName} for approval: <br><br>${link}`;
              const oldObj = results[0];
              if (oldObj) {
                if (item.toObject) {
                  item = item.toObject();
                }
                body += '<br><br><b>Summary of changes:</b><br><br>' +
                  shUtil.getUpdateTable(shUtil.getObjectChanges(oldObj.toObject(), item, omitProperties));
              }
            } else {
              body = `A new DFA ${type} has been submitted by ${req.user.fullName} for approval: <br><br>${link}`;
            }
            return sendHtmlMail(dfaAdminEmail, bizAdminEmail, `${itadminEmail},${ppmtEmail},${req.user.email}`,
              `${this.getEnv()}DFA - ${_.find(req.dfa.modules, {moduleId}).name} - ${_.upperFirst(type)} Submitted for Approval`, body);
          case ApprovalMode.approve:
            body = `The DFA ${type} submitted by ${item.updatedBy} for approval has been approved:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage.replace('\n', '<br>')}`;
            }
            return sendHtmlMail(bizAdminEmail, `${item.updatedBy}@cisco.com`, `${itadminEmail},${ppmtEmail}`,
              `${this.getEnv()}DFA - ${_.find(req.dfa.modules, {moduleId}).name} - ${_.upperFirst(type)} Approved`, body);
          case ApprovalMode.reject:
            body = `The DFA ${type} submitted by ${item.updatedBy} for approval has been rejected:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage.replace('\n', '<br>')}`;
            }
            return sendHtmlMail(bizAdminEmail, `${item.updatedBy}@cisco.com`, `${itadminEmail},${ppmtEmail}`,
              `${this.getEnv()}DFA - ${_.find(req.dfa.modules, {moduleId}).name} - ${_.upperFirst(type)} Not Approved`, body);
        }
      });

  }

  getEnv() {
    switch (process.env.NODE_ENV) {
      case 'dev':
        return 'LOCAL: ';
      case 'sdev':
        return 'DEV: ';
      case 'stage':
        return 'STAGE: ';
      default:
        return '';
    }
  }

}

