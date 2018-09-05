import {injectable} from 'inversify';
import DollarUploadRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {DfaModuleIds} from '../../../../shared/enums';
import {ApiError} from '../../../lib/common/api-error';
import DeptUploadRepo from '../dept-upload/repo';
import {DeptUploadPgRepo} from '../dept-upload/pgrepo';
import SubmeasureRepo from '../../common/submeasure/repo';
import {DollarUploadPg, DollarUploadPgRepo} from './pgrepo';
import * as _ from 'lodash';

@injectable()
export default class DollarUploadController extends ControllerBase {
  constructor(repo: DollarUploadRepo, pgRepo: DollarUploadPgRepo, private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncTransform(dums, userId, log, elog) {
    const tableName = 'dfa_prof_dept_acct_map_upld';
    const dups = [];
    return this.submeasureRepo.getManyActive({moduleId: DfaModuleIds.prof})
      .then(subs => {
        dums.forEach(dum => {
          const sub = _.find(subs, {name: dum.submeasureName});
          if (!sub) {
            throw new ApiError(`${tableName}: no submeasure for submeasureName: ${dum.submeasureName}`);
          }

          /*
  productLevelId: string;
  productLevelName: string;
  salesLevelId: string;
  salesLevelName: string;
  scmsLevelId: string;
  scmsLevelName: string;
  leLevelId: string;
  leLevelName: string;
  beLevelId: string;
  beLevelName: string;

           */
          const dup = new DollarUploadPg(dum);
          dup.measureId = dum.measureId;
          dup.submeasureKey = sub.submeasureKey;



          dups.push(dup);
        });
        return dups;
      });
  }

}
