import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {ModuleRepo} from './repo';
import {ModulePgRepo} from './pgrepo';


@injectable()
export default class ModuleController extends ControllerBase {
  constructor(protected repo: ModuleRepo, pgRepo: ModulePgRepo) {
    super(repo, pgRepo);
  }

  getActiveSortedByDisplayName(req, res, next) {
    this.repo.getActiveSortedByDisplayName()
      .then(docs => res.json(docs))
      .catch(next);
  }

  getActiveNonAdminSortedByDisplayName(req, res, next) {
    this.repo.getActiveNonAdminSortedByDisplayName()
      .then(docs => res.json(docs))
      .catch(next);
  }

  getNonAdminSortedByDisplayName(req, res, next) {
    this.repo.getNonAdminSortedByDisplayName()
      .then(docs => res.json(docs))
      .catch(next);
  }

}

