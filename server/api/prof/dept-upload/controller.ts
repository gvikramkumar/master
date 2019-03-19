import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import DeptUploadRepo from './repo';
import {DeptUploadPgRepo} from './pgrepo';
import SubmeasureRepo from '../../common/submeasure/repo';
import * as _ from 'lodash';
import {ApiError} from '../../../lib/common/api-error';
import {DfaModuleIds} from '../../../../shared/enums';

@injectable()
export default class DeptUploadController extends ControllerBase {
  constructor(repo: DeptUploadRepo, pgRepo: DeptUploadPgRepo, private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncTransform(objs, userId, log, elog) {
    const tableName = 'dfa_prof_dept_acct_map_upld';
    const records = [];
    return this.submeasureRepo.getManyLatestGroupByNameActive(DfaModuleIds.prof)
      .then(subs => {
        objs.forEach(obj => {
          const sub = _.find(subs, {name: obj.submeasureName});
          if (!sub) {
            throw new ApiError(`${tableName}: no submeasure for submeasureName: ${obj.submeasureName}`);
          }
          obj.submeasureKey = sub.submeasureKey;
        });
        return objs;
      });
  }



}
