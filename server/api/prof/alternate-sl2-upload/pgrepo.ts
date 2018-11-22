import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';


const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'actualSl2Code', field: 'actual_sl2_code'},
  {prop: 'alternateSl2Code', field: 'alternate_sl2_code'},
  {prop: 'alternateCountryName', field: 'alternate_country_name'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class AlternateSl2UploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_scms_triang_altsl2_map_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}

