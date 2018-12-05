import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import {ApprovalMode} from '../../../shared/enums';
import * as _ from 'lodash';

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
    let promise: Promise<any> = Promise.resolve();
    this.repo.validate(data);
    if (data.approvedOnce === 'Y') {
      data.status = data.activeStatus;
      data.approvedBy = req.user.id;
      data.approvedDate = new Date();
      if (data.activeStatus === 'I') {
        promise = this.repo.updateMany({moduleId: data.moduleId, name: data.name}, {$set: {status: 'I', activeStatus: 'I'}});
      }
    } else if (data.approvedOnce === 'N' && data.status === 'P') {
      data.status = 'A';
      data.activeStatus = 'A';
      data.approvedOnce = 'Y';
      data.approvedBy = req.user.id;
      data.approvedDate = new Date();
    }
    promise.then(() => {
      this.repo.update(data, req.user.id, true, true, false)
        .then(item => {
          return this.postApproveStep(item, req)
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
    req.body.status = 'D';
    this.updateOneNoValidatePromise(req.body, req.user.id, false)
      .then(item => {
        return this.sendApprovalEmail(req, ApprovalMode.reject, item)
          .then(() => res.json(item));
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

  sendApprovalEmail(req, mode: ApprovalMode, item): Promise<any> {
    return Promise.reject(new ApiError('sendApprovalEmail not defined for approval controller'));
  }

  getManyLatestByNameActiveInactiveConcatDraftPendingOfUser(req, res, next) {
    return Promise.all([
      this.repo.getManyLatestGroupByNameActive(req.body.moduleId),
      this.repo.getManyLatestGroupByNameInactive(req.body.moduleId),
      this.repo.getMany({
        status: {$in: ['D', 'P']},
        createdBy: req.user.id,
        moduleId: req.body.moduleId})
    ])
      .then(results => {
        const actives = results[0];
        const inactives = results[1];
        const draftPending = results[2];
        const names = _.uniq(actives.concat(inactives).map(x => x.name.toLowerCase()));
        const ailist = [];
        names.forEach(name => {
          // what we want is the lastest active, BUT... if there's a later inactive, or inactive and no active... then
          // we want the latest inactive, so they can make it active again if needed.
          const a = _.find(actives, x => x.name.toLowerCase() === name);
          const i = _.find(inactives, x => x.name.toLowerCase() === name);
          if (a && !i) {
            ailist.push(a);
          } else if (i && !a) {
            ailist.push(i);
          } else if (a.updatedDate >= i.updatedDate) {
            ailist.push(a);
          } else if (i.updatedDate > a.updatedDate) {
            ailist.push(i);
          }
        });

        res.json(ailist.concat(draftPending));
      })
      .catch(next);
  }

  postApproveStep(item, req) {
    return Promise.resolve();
  }

}

