import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'submeasureKey', field: 'sub_measure_key', type: OrmTypes.number},
  {prop: 'splitCategory', field: 'split_category'},
  {prop: 'splitPercentage', field: 'split_percentage', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class ProductClassUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_swalloc_manualmix_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

