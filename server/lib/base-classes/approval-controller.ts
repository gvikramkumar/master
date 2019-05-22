import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import {ApprovalMode} from '../../../shared/misc/enums';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import {shUtil} from '../../../shared/misc/shared-util';
import AnyObj from '../../../shared/models/any-obj';
import LookupRepo from '../../api/lookup/repo';
import moment from 'moment';
import UserListRepo from '../../api/user-list/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import config from '../../config/get-config';
import {mail} from '../common/mail';

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
    data.approvalReminderTime = new Date();
    let promise;
    if (saveMode === 'add') {
      promise = this.addOnePromise(req, res, next);
    } else if (saveMode === 'copy') {
      promise = this.copyOnePromise(req, res, next);
    } else if (saveMode === 'update') {
      promise = this.updatePromise(req, res, next);
    }
    promise
      .then(savedItem => {
        const newItem = _.clone(savedItem);
        newItem.approvalUrl = `${req.headers.origin}/prof/${req.query.type}/edit/${savedItem.id};mode=view`;
        this.repo.update(newItem, '', true, true, false)
          .then(updatedItem => {
            return this.sendApprovalEmail(req, ApprovalMode.submit, updatedItem)
              .then(() => res.json(updatedItem));
          });
      })
      .catch(next);
  }

  approveValidate(approvalItems, req, next): any {
    const invalidItems = [];
    approvalItems.forEach(item => {
      if (item.status !== 'P') {
        invalidItems.push(item);
      }
    });
    if (invalidItems.length) {
      throw new ApiError(`Not all items are pending: ${invalidItems.map(x => x.name)}`); // should never happen
    }

    const dups = shUtil.findDuplicatesByProperty(approvalItems, 'name');
    if (dups.length) {
      throw new ApiError(`Multiple approval items have the same name: ${dups.join(', ')}`);
    }

    return this.repo.getManyLatestGroupByNameActiveInactive(req.dfa.moduleId)
      .then(aiItems => {

        approvalItems.forEach(item => {
          // if new item, verify name doesn't exist already
          if (item.approvedOnce !== 'Y' && _.find(aiItems, {name: item.name})) {
            invalidItems.push(item);
          }
        });
        if (invalidItems.length) {
          throw new ApiError(`Name already exists for items: ${invalidItems.map(x => x.name).join(', ')}`);
        }

      });
  }

  approveMany(req, res, next) {
    const items = req.body;
    Promise.resolve()
      .then(() => {
        return this.approveValidate(items, req, next)
          .then(() => {
            items.forEach(item => this.approve(item, req, res, next));
          });
      })
      .catch(next);
  }

  approveOne(req, res, next) {
    const item = req.body;
    Promise.resolve()
      .then(() => {
        return this.approveValidate([item], req, next)
          .then(() => {
            this.approve(item, req, res, next);
          });
      })
      .catch(next);
  }

  approve(data, req, res, next) {
    this.repo.validate(data);
    let firstTimeApprove = false;
    if (data.approvedOnce === 'Y') {
      data.status = data.activeStatus;
      data.approvedBy = req.user.id;
      data.approvedDate = new Date();
    } else {
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
    });
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

  getManyLatestGroupByNameActive(req, res, next) {
    this.repo.getManyLatestGroupByNameActive(req.dfa.moduleId)
      .then(docs => res.send(docs))
      .catch(next);
  }

  getManyLatestGroupByNameActiveInactive(req, res, next) {
    this.repo.getManyLatestGroupByNameActiveInactive(req.dfa.moduleId)
      .then(docs => res.send(docs))
      .catch(next);
  }

  getManyLatestGroupByNameActiveInactiveConcatDraftPendingOfUser(req, res, next) {
    this.repo.getManyLatestGroupByNameActiveInactiveConcatDraftPendingOfUser(req.dfa.moduleId, req.user.id)
      .then(items => res.json(items))
      .catch(next);
  }

  getManyLatestGroupByNameActiveInactiveConcatDraftPending(req, res, next) {
   this.repo.getManyLatestGroupByNameActiveInactiveConcatDraftPending(req.dfa.moduleId)
     .then(items => res.json(items))
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

  sendApprovalEmailBase(req, mode: ApprovalMode, item: AnyObj, type: string, omitProperties): Promise<any> {
    const data = req.body;
    const moduleId = req.dfa.moduleId;
    const link = `<a href="${item.approvalUrl}">${item.approvalUrl}</a>`;
    let body, requester;
    const itadminEmail = req.dfa.itadminEmail;
    const dfaAdminEmail = req.dfa.dfaAdminEmail;
    const bizAdminEmail = req.dfa.bizAdminEmail;
    const ppmtEmail = req.dfa.ppmtEmail;
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
            return mail.sendHtmlMail(dfaAdminEmail, bizAdminEmail, `${itadminEmail},${ppmtEmail},${svrUtil.getEnvEmail(req.user.email)}`,
              `${this.getEnv()}DFA - ${_.find(req.dfa.modules, {moduleId}).name} - ${_.upperFirst(type)} Submitted for Approval`, body);
          case ApprovalMode.approve:
            body = `The DFA ${type} submitted by ${item.updatedBy} for approval has been approved:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage.replace('\n', '<br>')}`;
            }
            requester = svrUtil.getEnvEmail(`${item.updatedBy}@cisco.com`);
            return mail.sendHtmlMail(bizAdminEmail, requester, `${itadminEmail},${ppmtEmail}`,
              `${this.getEnv()}DFA - ${_.find(req.dfa.modules, {moduleId}).name} - ${_.upperFirst(type)} Approved`, body);
          case ApprovalMode.reject:
            body = `The DFA ${type} submitted by ${item.updatedBy} for approval has been rejected:<br><br>${link}`;
            if (data.approveRejectMessage) {
              body += `<br><br><br>Comments:<br><br>${data.approveRejectMessage.replace('\n', '<br>')}`;
            }
            requester = svrUtil.getEnvEmail(`${item.updatedBy}@cisco.com`);
            return mail.sendHtmlMail(bizAdminEmail, requester, `${itadminEmail},${ppmtEmail}`,
              `${this.getEnv()}DFA - ${_.find(req.dfa.modules, {moduleId}).name} - ${_.upperFirst(type)} Not Approved`, body);
        }
      });

  }

  approvalEmailReminder(type: string): any {
    const currentTime = new Date();
    return Promise.all([this.repo.getManyPending({moduleId : -1}),
      new LookupRepo().getValues(['itadmin-email', 'dfa-admin-email', 'dfa-biz-admin-email'])])
      .then(results => {
        const pendingItems = results[0].filter(doc => this.checkIfMoreThanReminderPeriod(currentTime, doc.approvalReminderTime));
        const adminEmails = results[1];
        if (pendingItems.length) {
          const promises = [];
          pendingItems.forEach(item => {
            promises.push(
            Promise.all([
              new ModuleRepo().getOneByQuery({moduleId: item.moduleId}),
              new UserListRepo().getOneLatest({userId: item.updatedBy})
            ])
              .then(itemResults => {
                const module = itemResults[0];
                const user = itemResults[1];
                return this.sendReminderEmail(adminEmails, module, user, item, type)
                  .then(() => {
                    item.approvalReminderTime = currentTime;
                    return this.repo.update(item, '', true, true, false);
                  });
              })
          );
          });
          return Promise.all(promises)
            .then(calls => `${calls.length} items updated.`);
        }
      });
  }

  checkIfMoreThanReminderPeriod(now, lastReminderTime) {
    return (now - lastReminderTime) > config.submitForApprovalReminderPeriod;
  }

  sendReminderEmail(adminEmails: string[], module, user, item, type: string) {
        const itadminEmail = svrUtil.getEnvEmail(adminEmails[0]);
        const dfaAdminEmail = svrUtil.getEnvEmail(adminEmails[1]);
        const dfaBizAdminEmail = svrUtil.getEnvEmail(adminEmails[2]);
        const link = `<a href="${item.approvalUrl}">${item.approvalUrl}</a>`;
        const body = `A new DFA - ${_.upperFirst(type)} submitted by ${user.fullName} has been pending for approval since ${shUtil.convertToPSTTime(item.updatedDate)}:<br><br>${link}`;
        const subject = `${this.getEnv()}DFA - ${module.name} - ${_.upperFirst(type)} Pending for Approval`;
        return mail.sendHtmlMail(dfaAdminEmail, dfaBizAdminEmail, `${itadminEmail},${svrUtil.getEnvEmail(user.email)}`, subject, body);
  }

  getEnv() {
    switch (config.env) {
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

