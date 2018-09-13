import RepoBase from './repo-base';
import ControllerBase from './controller-base';
import {ApiError} from '../common/api-error';
import DfaUser from '../../../shared/models/dfa-user';

export enum ApprovalMode {
  submit = 1,
  approve,
  reject
}

export default class ApprovalController extends ControllerBase {

  constructor(
    protected repo: RepoBase
    ) {
    super(repo);
  }

  saveToDraft(req, res, next) {
    req.body.status = 'D';
    this.addOneNoValidate(req, res, next);
  }

  submitForApproval(req, res, next) {
    this.handleApprovals(req, res, next, 'P', ApprovalMode.submit);
  }

  approve(req, res, next) {
    this.handleApprovals(req, res, next, 'A', ApprovalMode.approve);
  }

  reject(req, res, next) {
    req.body.status = 'D';
    this.addOneNoValidate(req, res, next);
    this.sendApprovalEmail(req.user, ApprovalMode.reject);
  }

  activate(req, res, next) {
    req.body.status = 'A';
    this.addOne(req, res, next);
  }

  inactivate(req, res, next) {
    req.body.status = 'I';
    this.addOneNoValidate(req, res, next);
  }

  handleApprovals(req, res, next, newStatus, mode) {
    const data = req.body;
    this.repo.validate(data);
    data.status = newStatus;
    if (mode === ApprovalMode.submit) {
      data.approvedOnce = 'Y';
    }
    this.repo.addOne(data, req.user.id)
      .then(item => {
        this.sendApprovalEmail(req.user, mode);
        res.json(item);
      })
      .catch(next);
  }

  sendApprovalEmail(user: DfaUser, mode: ApprovalMode) {
    throw new ApiError('sendApprovalEmail not defined for approval controller');
  }

}

