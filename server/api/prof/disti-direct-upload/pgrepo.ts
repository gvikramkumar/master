import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'groupId', field: 'group_id', type: OrmTypes.number},
  {prop: 'nodeType', field: 'node_type'},
  {prop: 'salesFinanceHierarchy', field: 'sales_finance_hierarchy'},
  {prop: 'nodeCode', field: 'node_code'},
  {prop: 'extTheaterName', field: 'ext_theater_name'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class DistiDirectUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_disti_to_direct_map_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

