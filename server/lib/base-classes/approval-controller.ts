import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import DfaUser from '../../../shared/models/dfa-user';
import mail from '../common/mail';
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
    this.repo.validate(data);
    data.status = 'P';
    let promise;
    if (saveMode === 'add') {
      promise = this.addOneNoValidatePromise(req, res, next);
    } else if (saveMode === 'copy') {
      promise = this.copyOneNoValidatePromise(req, res, next);
    } else if (saveMode === 'update') {
      promise = this.updateOneNoValidatePromise(req, res, next);
    }
    promise
      .then(item => {
        this.sendApprovalEmail(req, ApprovalMode.submit, item.id);
        res.json(item);
      })
      .catch(next);
  }

  approve(req, res, next) {
    const data = req.body;
    this.repo.validate(data);
    data.status = 'A';
    data.approvedOnce = 'Y';
    this.repo.update(data, req.user.id)
      .then(item => {
        this.sendApprovalEmail(req, ApprovalMode.approve, item.id);
        res.json(item);
      })
      .catch(next);
  }

  reject(req, res, next) {
    req.body.status = 'D';
    this.updateOneNoValidatePromise(req, res, next)
      .then(item => {
        this.sendApprovalEmail(req, ApprovalMode.reject, item.id);
        res.json(item);
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

  sendEmail(address, title, body) {
    return mail.send(
      address,
      address,
      title,
      null,
      body
    );
  }

  sendApprovalEmail(user: DfaUser, mode: ApprovalMode, id) {
    throw new ApiError('sendApprovalEmail not defined for approval controller');
  }

  getManyLatestByNameActiveConcatDraftPendingOfUser(req, res, next) {
    return Promise.all([
      this.repo.getManyByGroupLatest({
        groupField: 'name',
        status: 'A',
        moduleId: req.body.moduleId}),
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

