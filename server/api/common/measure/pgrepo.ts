import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'measureId', field: 'measure_id', type: OrmTypes.number},
  {prop: 'name', field: 'measure_name'},
  {prop: 'typeCode', field: 'measure_type_code'},
  {prop: 'approvalRequired', field: 'sub_measure_approval_flag'},
  {prop: null, field: 'sub_measure_notification_flag', pgDefault: 'Y'},
  {prop: 'isCogsMeasure', field: null},
  {prop: 'status', field: 'status_flag'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class MeasurePgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_measure';

  constructor() {
    super(new Orm(ormMap));
  }

}

