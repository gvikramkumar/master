import {PostgresRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import {injectable} from 'inversify';



const ormMap: OrmMap[] = [
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'fiscalMonth', field: 'fiscal_month_id'},
  {prop: 'openFlag', field: 'open_flag'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class OpenPeriodPostgresRepo extends PostgresRepoBase {
  table = 'fpadfa.dfa_open_period';
  idProp = 'moduleId';

  constructor() {
    super(ormMap);
  }
}
