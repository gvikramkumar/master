import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';


const ormMap: OrmMap[] = [
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'sourceId', field: 'source_system_id', type: OrmTypes.number},
  {prop: 'sourceName', field: 'source_system_name'},
  {prop: 'sourceTypeCode', field: 'source_system_type_code'},
  {prop: 'sourceStatus', field: 'status_flag'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class ModuleSourcePgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_data_sources';

  constructor() {
    super(new Orm(ormMap));
  }

}

