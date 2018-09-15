import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'submeasureKey', field: 'sub_measure_key', type: OrmTypes.number},
  {prop: 'accountId', field: 'account_code'},
  {prop: 'companyCode', field: 'company_code'},
  {prop: 'subaccountCode', field: 'sub_account_code'},
  {prop: 'salesTerritoryCode', field: 'sales_territory_code'},
  {prop: 'splitPercentage', field: 'split_percentage', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class SalesSplitPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_sales_split_pctmap_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

