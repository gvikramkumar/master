import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import DfaUser from '../../../shared/models/dfa-user';

enum Mode {
  submit = 1,
  approve,
  reject,
  activate
}

export default class ApprovalController extends ControllerBase {

  constructor(
    protected repo: RepoBase
    ) {
    super(repo);
  }

  saveToDraft(req, res, next) {
    this.addOneNoValidate(req, res, next);
  }

  submitForApproval(req, res, next) {
    this.handleApprovals(req, res, next, 'P', Mode.submit);
  }

  approve(req, res, next) {
    this.handleApprovals(req, res, next, 'A', Mode.approve);
  }

  reject(req, res, next) {
    req.body.status = 'D';
    this.addOneNoValidate(req, res, next);
    this.sendApprovalEmail(req.user, Mode.reject);
  }

  activate(req, res, next) {
    this.handleApprovals(req, res, next, 'A', Mode.activate);
  }

  inactivate(req, res, next) {
    req.body.status = 'I';
    this.addOneNoValidate(req, res, next);
  }

  handleApprovals(req, res, next, newStatus, mode) {
    const data = req.body;
    const errors = this.repo.validate(data);
    if (errors) {
      next(new ApiError('Validation Errors', errors, 400));
      return;
    }
    data.status = newStatus;
    if (mode === Mode.submit) {
      data.approvedOnce = true;
    }
    this.repo.addOne(data, req.user.id)
      .then(item => {
        this.sendApprovalEmail(req.user, mode);
        res.json(item);
      })
      .catch(next);
  }

  sendApprovalEmail(user: DfaUser, mode: Mode) {

  }

}

