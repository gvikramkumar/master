import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import DistiDirectUploadRepo from './repo';
import SubmeasureRepo from '../../common/submeasure/repo';
import {DistiDirectUploadPgRepo} from './pgrepo';
import {ApiError} from '../../../lib/common/api-error';
import PgLookupRepo from '../../pg-lookup/repo';
import {ApiDfaData} from '../../../lib/middleware/add-global-data';


@injectable()
export default class DistiDirectUploadController extends ControllerBase {
  constructor(
    repo: DistiDirectUploadRepo,
    pgRepo: DistiDirectUploadPgRepo,
    private pgLookupRepo: PgLookupRepo) {
    super(repo, pgRepo);
  }

  postSyncStep(dfa: ApiDfaData) {
    return Promise.all([
      this.pgLookupRepo.updateDistiUploadExtTheaterNameDistiSL3(dfa.fiscalMonths.prof),
      this.pgLookupRepo.updateDistiUploadExtTheaterNameDirectSL2(dfa.fiscalMonths.prof),
  ]);
  }

}
