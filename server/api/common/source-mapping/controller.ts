import {injectable} from 'inversify';
import PostgresControllerBase from '../../../lib/base-classes/pg-controller-base';
import {PostgresSourceMappingRepo} from './repo';


@injectable()
export default class SourceMappingController extends PostgresControllerBase {
  constructor(repo: PostgresSourceMappingRepo) {
    super(repo);
  }

  syncRecordsQueryOne(req, res, next) {


    this.repo.syncRecordsQueryOne(req.query, null,  null, req.body, req.user.id)
      .then(() => res.end());
  }

}

