import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import {injectable} from 'inversify';

export class SubmeasureInputLvl {
  constructor(
    public moduleId: number,
    public submeasureKey: number,
    public hierarchyId: number,
    public inputLevelFlag: ('I' | 'M'),
    public levelId: number,
    public levelName: string,
    public createdBy: string,
    public createdDate: Date,
    public updatedBy: string,
    public updatedDate: Date
  ) {}
}

const ormMap: OrmMap[] = [
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'submeasureKey', field: 'sub_measure_key', type: OrmTypes.number},
  {prop: 'hierarchyId', field: 'hierarchy_id', type: OrmTypes.number},
  {prop: 'inputLevelFlag', field: 'input_level_flag'}, // I/M
  {prop: 'levelId', field: 'level_id', type: OrmTypes.number},
  {prop: 'levelName', field: 'level_name'}, // PF/BU/etc
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export default class InputLevelPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_submeasure_input_lvl';

  constructor() {
    super(new Orm(ormMap));
  }
}
