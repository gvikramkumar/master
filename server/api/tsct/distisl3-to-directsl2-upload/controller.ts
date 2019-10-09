import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import Distisl3ToDirectsl2UploadRepo from './repo';
import {DfaModuleIds} from '../../../../shared/misc/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {Distisl3ToDirectsl2UploadPgRepo} from './pgrepo';
import _ from 'lodash';


@injectable()
export default class Distisl3ToDirectsl2UploadController extends ControllerBase {
  constructor(
    repo: Distisl3ToDirectsl2UploadRepo,
    pgRepo: Distisl3ToDirectsl2UploadPgRepo,
    private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  // mongoToPgSyncTransform(objs, userId, log, elog) {
  //   const tableName = 'dfa_tsct_disti_to_direct_map_upld';
  //   const records = [];
  //   return this.submeasureRepo.getManyLatestGroupByNameActive(DfaModuleIds.tsct)
  //     .then(subs => {
  //       objs.forEach(obj => {
  //         const sub = _.find(subs, x => x.name.toLowerCase() === obj.submeasureName.toLowerCase());
  //         if (!sub) {
  //           throw new ApiError(`${tableName}: no submeasure for submeasureName: ${obj.submeasureName}.`);
  //         }
  //         obj.submeasureKey = sub.submeasureKey;
  //       });
  //       return objs;
  //     });
  // }

  // mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
  //   const keys = _.uniq(objs.map(sm => sm.submeasureKey));
  //   let where;
  //   // if we pass this where clause with "no keys", i.e. empty parenthesis, postgres throws an error,
  //   // so pass an undefined where to syncRecordsReplaceAllWhere which will then ignore the delete statement
  //   if (keys.length) {
  //     where = `fiscal_month_id = ${dfa.fiscalMonths.tsct} and sub_measure_key in (${keys})`;
  //   }
  //   return this.pgRepo.syncRecordsReplaceAllWhere(where, objs, userId, true)
  //     .then(results => results.recordCount);
  // }

  // getManualMixValuesForSubmeasureName(req, res, next) {
  //   return this.repo.getMany({submeasureName: req.body.submeasureName})
  //     .then(docs => {
  //       if (!docs.length) {
  //         res.status(204).end();
  //       } else {
  //         if (docs.length !== 2) {
  //           throw new ApiError(`getManualMixValuesForSubmeasureName: expected 2 records but got: ${docs.length}.`);
  //         }
  //         const hw = _.find(docs, {splitCategory: 'HARDWARE'});
  //         const sw = _.find(docs, {splitCategory: 'SOFTWARE'});
  //         if (!(hw && sw)) {
  //           throw new ApiError(`getManualMixValuesForSubmeasureName: missing HW or SW value.`);
  //         }
  //         res.json({
  //           HW: hw.splitPercentage,
  //           SW: sw.splitPercentage
  //         });
  //       }
  //     })
  //     .catch(next);
  // }

}
