import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import DistiDirectUploadRepo from './repo';
import SubmeasureRepo from '../../common/submeasure/repo';
import {DistiDirectUploadPgRepo} from './pgrepo';
import {ApiError} from '../../../lib/common/api-error';


@injectable()
export default class DistiDirectUploadController extends ControllerBase {
  constructor(
    repo: DistiDirectUploadRepo,
    pgRepo: DistiDirectUploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  postSyncStep() {
    // add this to base controller class and have this fill in theater_name for current fiscalmonth in pg
    throw new ApiError('postSyncStep not implemented');
    return Promise.resolve();
  }

}
