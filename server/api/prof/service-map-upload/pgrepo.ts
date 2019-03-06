import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'salesTerritoryCode', field: 'sales_territory_code'},
  {prop: 'salesNodeLevel1Code', field: 'sales_node_level_1_code'},
  {prop: 'salesNodeLevel2Code', field: 'sales_node_level_2_code'},
  {prop: 'salesNodeLevel3Code', field: 'sales_node_level_3_code'},
  {prop: 'salesNodeLevel4Code', field: 'sales_node_level_4_code'},
  {prop: 'salesNodeLevel5Code', field: 'sales_node_level_5_code'},
  {prop: 'salesNodeLevel6Code', field: 'sales_node_level_6_code'},
  {prop: 'businessEntity', field: 'business_entity'},
  {prop: 'technologyGroup', field: 'technology_group'},
  {prop: 'businessUnit', field: 'business_unit'},
  {prop: 'productFamily', field: 'product_family'},
  {prop: 'splitPercentage', field: 'split_percentage', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class ServiceMapUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_service_map_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

