import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';


const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'salesCountryName', field: 'sales_country_name'},
  {prop: 'salesTerritoryCode', field: 'sales_territory_code'},
  {prop: 'scmsValue', field: 'scms_value'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class CorpAdjustmentsUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_scms_triang_corpadj_map_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

