import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SalesSplitUploadRepo from './repo';
import {SalesSplitUploadPgRepo} from './pgrepo';


@injectable()
export default class SalesSplitUploadController extends ControllerBase {
  constructor(repo: SalesSplitUploadRepo, pgRepo: SalesSplitUploadPgRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    return this.pgRepo.syncRecordsQueryOneDeleteInsertNoChecks(pgRemoveFilter, ['accountId', 'companyCode', 'subaccountCode', 'salesTerritoryCode'],
      objs, userId, true, false)
      .then(results => results.recordCount);
  }

}
