import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {ModuleRepo} from './repo';
import {ModulePgRepo} from './pgrepo';


@injectable()
export default class ModuleController extends ControllerBase {
  constructor(protected repo: ModuleRepo, pgRepo: ModulePgRepo) {
    super(repo, pgRepo);
  }

  getActiveSortedByDisplayOrder(req, res, next) {
    this.repo.getActiveSortedByDisplayOrder()
      .then(docs => res.json(docs))
      .catch(next);
  }

  getActiveNonAdminSortedByDisplayOrder(req, res, next) {
    this.repo.getActiveNonAdminSortedByDisplayOrder()
      .then(docs => res.json(docs))
      .catch(next);
  }

  getNonAdminSortedByDisplayOrder(req, res, next) {
    this.repo.getNonAdminSortedByDisplayOrder()
      .then(docs => res.json(docs))
      .catch(next);
  }

}

