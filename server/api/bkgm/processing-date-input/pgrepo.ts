import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';


const ormMap: OrmMap[] = [
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'bkgm_process_start_date', field: 'bkgm_process_start_date', type: OrmTypes.date},
  {prop: 'bkgm_process_end_date', field: 'bkgm_process_end_date', type: OrmTypes.date},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class ProcessDateInputPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_bkgm_data_proc';

  constructor() {
    super(new Orm(ormMap));
  }

}