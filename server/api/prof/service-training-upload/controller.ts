import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ServiceTrainingUploadRepo from './repo';
import {ServiceTrainingUploadPgRepo} from './pgrepo';


@injectable()
export default class ServiceTrainingUploadController extends ControllerBase {
  constructor(repo: ServiceTrainingUploadRepo, pgRepo: ServiceTrainingUploadPgRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    return this.pgRepo.syncRecordsQueryOneDeleteInsertNoChecks(pgRemoveFilter, ['accountId', 'companyCode', 'subaccountCode', 'salesTerritoryCode'],
      objs, userId, true, false)
      .then(results => results.recordCount);
  }

}
