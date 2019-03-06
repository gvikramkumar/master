import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ServiceMapUploadRepo from './repo';
import {ServiceMapUploadPgRepo} from './pgrepo';


@injectable()
export default class ServiceMapUploadController extends ControllerBase {
  constructor(repo: ServiceMapUploadRepo, pgRepo: ServiceMapUploadPgRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    return this.pgRepo.syncRecordsQueryOneDeleteInsertNoChecks(pgRemoveFilter, ['accountId', 'companyCode', 'subaccountCode', 'salesTerritoryCode'],
      objs, userId, true, false)
      .then(results => results.recordCount);
  }

}
