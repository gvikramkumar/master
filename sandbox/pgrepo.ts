import {Orm, OrmMap, OrmTypes} from '../server/lib/base-classes/Orm';
import {PgRepoBase} from '../server/lib/base-classes/pg-repo-base';

const ormMap: OrmMap[] = [
  {prop: 'idCol', field: 'id_col', type: OrmTypes.number, serial: true},
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'name', field: 'user_name'},
  {prop: 'age', field: 'user_age', type: OrmTypes.number},
  {prop: 'createdBy', field: 'created_by'},
  {prop: 'createdDate', field: 'created_date', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'updated_by'},
  {prop: 'updatedDate', field: 'updated_date', type: OrmTypes.date},
] ;

export class PgRepo extends PgRepoBase {
  table = 'public.sync_test';
  idProp = 'idCol';

  constructor() {
    super(new Orm(ormMap));
  }
}




