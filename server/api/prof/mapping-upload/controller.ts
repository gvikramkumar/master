import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import MappingUploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/enums';
import {ApiError} from '../../../lib/common/api-error';
import {addFilterLevelColumnsForPgSync} from '../dollar-upload/controller';
import SubmeasureRepo from '../../common/submeasure/repo';
import {MappingUploadPg, MappingUploadPgRepo} from './pgrepo';
import * as _ from 'lodash';

@injectable()
export default class MappingUploadController extends ControllerBase {
  constructor(repo: MappingUploadRepo, pgRepo: MappingUploadPgRepo, private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncTransform(mums, userId, log, elog) {
    const tableName = 'dfa_prof_dept_acct_map_upld';
    const mups = [];
    return this.submeasureRepo.getManyActive({moduleId: DfaModuleIds.prof})
      .then(subs => {
        mums.forEach(mum => {
          const sub = _.find(subs, {name: mum.submeasureName});
          if (!sub) {
            throw new ApiError(`${tableName}: no submeasure for submeasureName: ${mum.submeasureName}`);
          }

          const mup = new MappingUploadPg(mum);
          mup.measureId = sub.measureId;
          mup.submeasureKey = sub.submeasureKey;
          addFilterLevelColumnsForPgSync(tableName, sub, mum, mup, log, elog);
          mups.push(mup);
        });
        return mups;
      });
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    const keys = _.uniq(objs.map(sm => sm.submeasureKey));
    const where = `fiscal_month_id = ${dfa.fiscalMonths.prof} and sub_measure_key in (${keys})`;
    return this.pgRepo.syncRecordsReplaceAllWhere(where, objs, userId, true)
      .then(results => results.recordCount);
  }

}
