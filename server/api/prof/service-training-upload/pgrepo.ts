import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';


const ormMap: OrmMap[] = [
  {prop: 'fiscalYear', field: 'fiscal_year', type: OrmTypes.number},
  {prop: 'salesTerritoryCode', field: 'sales_territory_code'},
  {prop: 'salesNodeLevel3Code', field: 'sales_node_level_3_code'},
  {prop: 'extTheaterName', field: 'ext_theater_name'},
  {prop: 'salesCountryName', field: 'sales_country_name'},
  {prop: 'productFamily', field: 'product_family'},
  {prop: 'splitPercentage', field: 'split_percentage', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class ServiceTrainingUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_service_trngsplit_pctmap_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

