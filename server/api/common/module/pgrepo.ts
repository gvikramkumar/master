import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'abbrev', field: 'module_abbr', type: OrmTypes.number},
  {prop: 'name', field: 'module_name'},
  {prop: 'status', field: 'status_flag'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class ModulePgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_module';

  constructor() {
    super(new Orm(ormMap));
  }

}

