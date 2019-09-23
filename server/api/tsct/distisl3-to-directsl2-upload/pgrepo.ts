import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  // To-DO change the column names according to the pg table once created
  {prop: 'driverSl2', field: 'driver_sl2'},
  {prop: 'sourceSl2', field: 'source_sl2'},
  {prop: 'externalTheater', field: 'external_theater'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class Distisl3ToDirectsl2UploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_tsct_distysl3_to_distysl2_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

