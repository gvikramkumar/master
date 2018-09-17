import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ProductClassUploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {ProductClassUploadPgRepo} from './pgrepo';
import * as _ from 'lodash';


@injectable()
export default class ProductClassUploadController extends ControllerBase {
  constructor(
    repo: ProductClassUploadRepo,
    pgRepo: ProductClassUploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncTransform(objs, userId, log, elog) {
    const tableName = 'dfa_prof_swalloc_manualmix_upld';
    const records = [];
    return this.submeasureRepo.getManyActive({moduleId: DfaModuleIds.prof})
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
