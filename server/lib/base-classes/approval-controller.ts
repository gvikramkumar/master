import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import DfaUser from '../../../shared/models/dfa-user';
import {ApprovalMode} from '../../../shared/enums';

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
    if (data.approvedOnce === 'Y') {
     data.status = data.activeStatus;
    } else if (data.approvedOnce === 'N' && data.status === 'P') {
      data.status = 'A';
      data.activeStatus = 'A';
      data.approvedOnce = 'Y';
    }

    this.repo.update(data, req.user.id)
      .then(item => {
        return this.sendApprovalEmail(req, ApprovalMode.approve, item)
          .then(() => res.json(item));
      })
      .catch(next);
  }

  reject(req, res, next) {
    req.body.status = 'D';
    this.updateOneNoValidatePromise(req, res, next)
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

  getManyLatestByNameActiveConcatDraftPending(req, res, next) {
    return Promise.all([
      this.repo.getManyLatestGroupByNameActive(req.body.moduleId),
      this.repo.getMany({
        status: {$in: ['D', 'P']},
        moduleId: req.body.moduleId}),
    ])
      .then(results => {
        res.json(results[0].concat(results[1]));
      })
      .catch(next);
  }

  getManyLatestByNameActiveConcatDraftPendingOfUser(req, res, next) {
    return Promise.all([
      this.repo.getManyLatestGroupByNameActive(req.body.moduleId),
      this.repo.getMany({
        status: {$in: ['D', 'P']},
        createdBy: req.user.id,
        moduleId: req.body.moduleId}),
    ])
      .then(results => {
        res.json(results[0].concat(results[1]));
      })
      .catch(next);
  }

}

