import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import MappingUploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/misc/enums';
import {ApiError} from '../../../lib/common/api-error';
import {addFilterLevelColumnsForPgSync} from '../dollar-upload/controller';
import SubmeasureRepo from '../../common/submeasure/repo';
import {MappingUploadPg, MappingUploadPgRepo} from './pgrepo';
import _ from 'lodash';

@injectable()
export default class MappingUploadController extends ControllerBase {
  constructor(repo: MappingUploadRepo, pgRepo: MappingUploadPgRepo, private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncTransform(mums, userId, log, elog) {
    const tableName = 'dfa_prof_manual_map_upld';
    const mups = [];
    return this.submeasureRepo.getManyLatestGroupByNameActive(DfaModuleIds.prof)
      .then(subs => {
        mums.forEach(mum => {
          const sub = _.find(subs, x => x.name.toLowerCase() === mum.submeasureName.toLowerCase());
          if (!sub) {
            throw new ApiError(`${tableName}: no submeasure for submeasureName: ${mum.submeasureName}.`);
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
    let where;
    // if we pass this where clause with "no keys", i.e. empty parenthesis, postgres throws an error,
    // so pass an undefined where to syncRecordsReplaceAllWhere which will then ignore the delete statement
    if (keys.length) {
      where = `fiscal_month_id = ${dfa.fiscalMonths.prof} and sub_measure_key in (${keys})`;
    }
    return this.pgRepo.syncRecordsReplaceAllWhere(where, objs, userId, true)
      .then(results => results.recordCount);
  }

}
