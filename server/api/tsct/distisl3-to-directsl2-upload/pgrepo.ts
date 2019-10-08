import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  // To-DO change the column names according to the pg table once created
  {prop: 'driverSl2', field: 'sales_node_level_3_code'},
  {prop: 'sourceSl2', field: 'sales_node_level_2_code'},
  {prop: 'externalTheater', field: 'ext_theater_name'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class Distisl3ToDirectsl2UploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_tsct_disti_to_direct_map_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

