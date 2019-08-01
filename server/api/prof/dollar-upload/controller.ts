import {injectable} from 'inversify';
import DollarUploadRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {DfaModuleIds} from '../../../../shared/misc/enums';
import {ApiError} from '../../../lib/common/api-error';
import SubmeasureRepo from '../../common/submeasure/repo';
import {DollarUploadPg, DollarUploadPgRepo} from './pgrepo';
import _ from 'lodash';
import {filterLevelMap} from '../../../../shared/models/filter-level-map';

@injectable()
export default class DollarUploadController extends ControllerBase {
  constructor(repo: DollarUploadRepo, pgRepo: DollarUploadPgRepo, private submeasureRepo: SubmeasureRepo) {
    super(repo, pgRepo);
  }

  mongoToPgSyncTransform(dums, userId, log, elog) {
    const tableName = 'dfa_prof_input_amnt_upld';
    const dups = [];
    return this.submeasureRepo.getManyLatestGroupByNameActive(DfaModuleIds.prof)
      .then(subs => {
        dums.forEach(dum => {
          const sub = _.find(subs, x => x.name.toLowerCase() === dum.submeasureName.toLowerCase());
          if (!sub) {
            throw new ApiError(`${tableName}: no submeasure for submeasureName: ${dum.submeasureName}.`);
          }

          const dup = new DollarUploadPg(dum);
          dup.measureId = sub.measureId;
          dup.submeasureKey = sub.submeasureKey;
          addFilterLevelColumnsForPgSync(tableName, sub, dum, dup, log, elog);
          dups.push(dup);
        });
        return dups;
      });
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa) {
    if (pgRemoveFilter) { // syncMap.dfa_prof_input_amnt_upld
      return super.mongoToPgSyncRecords(pgRemoveFilter, objs, userId);
    } else { // syncMap.dfa_prof_input_amnt_upld_autosync
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

}

export function addFilterLevelColumnsForPgSync(tableName, sub, dum, dup, log, elog) {
  const productLevel = sub.inputFilterLevel.productLevel || (
    sub.indicators.manualMapping && sub.manualMapping.productLevel);
  if (dum.product) {
    const map = _.find(filterLevelMap, {prop: 'productLevel', levelName: productLevel});
    if (!map) {
      elog.push(`${tableName}: no map found for submeasure: ${sub.submeasureKey}, levelName: ${productLevel}`);
    } else {
      dup.productValue = dum.product;
      dup.productLevelId = map.levelId;
      dup.productLevelName = map.levelName;
    }
  }

  const salesLevel = sub.inputFilterLevel.salesLevel || (
    sub.indicators.manualMapping && sub.manualMapping.salesLevel);
  if (dum.sales) {
    const map = _.find(filterLevelMap, {prop: 'salesLevel', levelName: salesLevel});
    if (!map) {
      elog.push(`${tableName}: no map found for submeasure: ${sub.submeasureKey}, levelName: ${salesLevel}`);
    } else {
      dup.salesValue = dum.sales;
      dup.salesLevelId = map.levelId;
      dup.salesLevelName = map.levelName;
    }
  }

  const scmsLevel = sub.inputFilterLevel.scmsLevel || (
    sub.indicators.manualMapping && sub.manualMapping.scmsLevel);
  if (dum.scms) {
    const map = _.find(filterLevelMap, {prop: 'scmsLevel', levelName: scmsLevel});
    if (!map) {
      elog.push(`${tableName}: no map found for submeasure: ${sub.submeasureKey}, levelName: ${scmsLevel}`);
    } else {
      dup.scmsValue = dum.scms;
      dup.scmsLevelId = map.levelId;
      dup.scmsLevelName = map.levelName;
    }
  }

  const entityLevel = sub.inputFilterLevel.entityLevel || (
    sub.indicators.manualMapping && sub.manualMapping.entityLevel);
  if (dum.legalEntity) {
    const map = _.find(filterLevelMap, {prop: 'entityLevel', levelName: entityLevel});
    if (!map) {
      elog.push(`${tableName}: no map found for submeasure: ${sub.submeasureKey}, levelName: ${entityLevel}`);
    } else {
      dup.leValue = dum.legalEntity;
      dup.leLevelId = map.levelId;
      dup.leLevelName = map.levelName;
    }
  }

  const beLevel = sub.inputFilterLevel.internalBELevel || (
    sub.indicators.manualMapping && sub.manualMapping.internalBELevel);
  if (dum.intBusinessEntity) {
    const map = _.find(filterLevelMap, {prop: 'internalBELevel', levelName: beLevel});
    if (!map) {
      elog.push(`${tableName}: no map found for submeasure: ${sub.submeasureKey}, levelName: ${entityLevel}`);
    } else {
      dup.beValue = dum.intBusinessEntity;
      dup.beLevelId = map.levelId;
      dup.beLevelName = map.levelName;
    }
  }

}
