import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import CorpAdjustmentsUploadRepo from './repo';
import SubmeasureRepo from '../../common/submeasure/repo';
import {CorpAdjustmentsUploadPgRepo} from './pgrepo';
import * as _ from 'lodash';
import {svrUtil} from '../../../lib/common/svr-util';

@injectable()
export default class CorpAdjustmentsUploadController extends ControllerBase {
  constructor(
    repo: CorpAdjustmentsUploadRepo,
    pgRepo: CorpAdjustmentsUploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    const keys = _.uniq(objs.map(obj => `'${obj.salesCountryName && svrUtil.postgresReplaceQuotes(obj.salesCountryName).toUpperCase()}'`));
    const where = `fiscal_month_id = ${dfa.fiscalMonths.prof} and upper(sales_country_name) in (${keys})`;
    return this.pgRepo.syncRecordsReplaceAllWhere(where, objs, userId, true)
      .then(results => results.recordCount);
  }

}
