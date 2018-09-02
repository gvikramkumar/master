import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: '', type: OrmTypes.number},
  {prop: 'submeasureName', field: ''},
  {prop: 'product', field: ''},
  {prop: 'sales', field: ''},
  {prop: 'scms', field: ''},
  {prop: 'legalEntity', field: ''},
  {prop: 'intBusinessEntity', field: ''},
  {prop: 'dealId', field: ''},
  {prop: 'grossUnbilledAccruedFlag', field: ''},
  {prop: 'revenueClassification', field: ''},
  {prop: 'amount', field: '', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class DollarUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_input_amnt_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

