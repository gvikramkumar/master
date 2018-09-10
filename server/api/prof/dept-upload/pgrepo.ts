import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id'},
  {prop: 'submeasureName', field: ''},
  {prop: 'submeasureKey', field: 'sub_measure_key'},
  {prop: 'nodeValue', field: 'node_value'},
  {prop: 'glAccount', field: 'gl_account', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class DeptUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_dept_acct_map_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

