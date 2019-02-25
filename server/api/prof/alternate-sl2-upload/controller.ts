import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import AlternateSl2UploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {AlternateSl2UploadPgRepo} from './pgrepo';
import * as _ from 'lodash';


@injectable()
export default class AlternateSl2UploadController extends ControllerBase {
  constructor(
    repo: AlternateSl2UploadRepo,
    pgRepo: AlternateSl2UploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    return this.pgRepo.syncRecordsQueryOneDeleteInsertNoChecks(pgRemoveFilter, ['actualSl2Code', 'alternateSl2Code'],
      objs, userId, true, false)
      .then(results => results.recordCount);
  }

}
