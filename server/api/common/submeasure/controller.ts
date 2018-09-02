import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SubmeasureRepo from './repo';
import {ApiError} from '../../../lib/common/api-error';
import {GroupingSubmeasure} from './grouping-submeasure';
import SubmeasurePgRepo from './pgrepo';
import SubmeasureInputLvlPgRepo, {SubmeasureInputLvl} from './input-level-pgrepo';
import * as _ from 'lodash';
import InputLevelPgRepo from './input-level-pgrepo';
import AnyObj from '../../../../shared/models/any-obj';
import Any = jasmine.Any;


interface FilterLevel {
  productLevel: string;
  salesLevel: string;
  scmsLevel: string;
  internalBELevel: string;
  entityLevel: string;
}

@injectable()
export default class SubmeasureController extends ControllerBase {

  filterLevelMap: {prop: string, hierarchyId: number, levelId: number, levelName: string}[] = [
    {prop: 'productLevel',	hierarchyId: 1, levelId:	1, levelName: 'TG'},
    {prop: 'productLevel',	hierarchyId: 1, levelId:	2, levelName: 'BU'},
    {prop: 'productLevel',	hierarchyId: 1, levelId:	3, levelName: 'PG'},
    {prop: 'productLevel',	hierarchyId: 1, levelId:	4, levelName: 'PID'},
    {prop: 'salesLevel',	hierarchyId: 2, levelId:	1, levelName: 'LEVEL1'},
    {prop: 'salesLevel',	hierarchyId: 2, levelId:	2, levelName: 'LEVEL2'},
    {prop: 'salesLevel',	hierarchyId: 2, levelId:	3, levelName: 'LEVEL3'},
    {prop: 'salesLevel',	hierarchyId: 2, levelId:	4, levelName: 'LEVEL4'},
    {prop: 'salesLevel',	hierarchyId: 2, levelId:	5, levelName: 'LEVEL5'},
    {prop: 'salesLevel',	hierarchyId: 2, levelId:	6, levelName: 'LEVEL6'},
    {prop: 'scmsLevel',	hierarchyId: 7, levelId:	1, levelName: 'SCMS'},
    {prop: 'entityLevel',	hierarchyId: 3, levelId:	1, levelName: 'BE'},
    {prop: 'internalBELevel',	hierarchyId: 8, levelId:	1, levelName: 'INTERNAL BE'},
    {prop: 'internalBELevel',	hierarchyId: 8, levelId:	2, levelName: 'INTERNAL SUB BE'},
  ];

  constructor(
    protected repo: SubmeasureRepo,
    protected pgRepo: SubmeasurePgRepo,
    protected inputLevelPgRepo: InputLevelPgRepo
) {
    super(repo);
  }

  mongoToPgSyncTransform(subs, userId, log: string[]) {
    const tableName = 'dfa_submeasure_input_lvl';
    const records = [];
    subs.forEach(sub => {
      this.addFilterLevelRecords('I', sub.inputFilterLevel, sub, records, log);
      if (sub.indicators.manualMapping) {
        this.addFilterLevelRecords('M', sub.manualMapping, sub, records, log);
      }
    })
    return this.inputLevelPgRepo.syncRecordsReplaceAll({}, records, userId)
      .then(results => log.push(`dfa_submeasure_input_lvl: ${results.recordCount}`));
  }

  addFilterLevelRecords(flag, fl, sub, records, log) {
    ['productLevel', 'salesLevel', 'scmsLevel', 'internalBELevel', 'entityLevel'].forEach(flProp => {
      if (fl[flProp]) {
        const map = _.find(this.filterLevelMap, {prop: flProp, levelName: fl[flProp]});
        if (!map) {
          log.push(`dfa_submeasure_input_lvl: no filterLevelMap for flag/prop/levelName: ${flag}/${fl.prop}/${fl.levelName}`);
          return;
        }
        records.push(new SubmeasureInputLvl(
          sub.moduleId,
          sub.submeasureKey,
          map.hierarchyId,
          flag,
          map.levelId,
          map.levelName
        ));
      }
    });
  }

  pgToMongoSync(req, res, next) {
    Promise.all([
      this.pgRepo.getMany(),
      this.inputLevelPgRepo.getMany()
    ])
      .then(results => {
        const subs = results[0];
        const ifls = this.setFilterLevels(results[0], results[1]);
        return this.repo.syncRecordsReplaceAll({}, subs, req.user.id, true)
          .then(() => res.json({submeasureCount: subs.length}));
      })
      .catch(next);
  }

  setFilterLevels(subs, filterLevels) {
    filterLevels.forEach(fl => {
      const sub = _.find(subs, {submeasureKey: fl.submeasureKey});
      if (!sub) {
        console.error(`setFilterLevels: no matching submeasure for submeasureKey: ${fl.submesureKey}.`);
        return;
      }
      const map = _.find(this.filterLevelMap, {hierarchyId: fl.hierarchyId});
      if (!map) {
        console.error(`setFilterLevels: can't find map for hierarchyId: ${fl.hierarchyId}`);
        return;
      }
      let path: string;
      if (fl.inputLevelFlag === 'I') {
        path = 'inputFilterLevel.' + map.prop;
      } else if (fl.inputLevelFlag === 'M') {
        path = 'manualMapping.' + map.prop;
      } else {
        console.error(`setFilterLevels: invalid inputLevelFlag: ${fl.inputLevelFlag}`);
        return;
      }
      _.set(sub, path, fl.levelName);
    });
  }

  getGroupingSubmeasures(req, res, next) {
    const measureId = req.body.measureId;
    if (!measureId) {
      throw new ApiError('getGroupingSubmeasures called with no measureId');
    }
    this.repo.getGroupingSubmeasures(measureId)
      .then(docs => res.json(docs));
  }


/*

// ***** NEED TO GET NEXT sub_measure_key from pg to start it off, so no autoinc field for mongo repo then
  addOne(req, res, next) {
    const data = req.body;
    this.repo.addOne(data, req.user.id)
      .then(item => {
        this.pgRepo.addOne(_.clone(item), req.user.id) // pgRepo changes updated date so clone it
          .then(() => {
            const inputLvls = [];

            //get input levls toegher
            return inputLvlPgRepo.addMany(inputLvls, req.user.id)
              .then(() => res.json(item));
          });
      })
      .catch(next);
  }
*/



}

