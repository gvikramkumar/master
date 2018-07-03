import {pgc} from '../postgres-conn';
import _config from '../../../config/get-config';
import _ from 'lodash';
import {injectable} from 'inversify';

const config = _config.postgres;

@injectable()
export default class PostgresRepo {

  constructor() {
  }

  getProductHierarchyReport() {
    return pgc.pgdb.query(`
            select 
            technology_group_id, 
            business_unit_id, 
            product_family_id
            from ${config.conSchema}.vw_fds_products
            group by 1,2,3 order by 1,2,3    
          `);
  }

  getSalesHierarchyReport() {
    return pgc.pgdb.query(`
            select 
            l1_sales_territory_descr,
            l2_sales_territory_descr,
            l3_sales_territory_descr,
            l4_sales_territory_descr,
            l5_sales_territory_descr,
            l6_sales_territory_descr
            from fdscon.vw_fds_sales_hierarchy
            where sales_territory_type_code in ('CORP. REVENUE')
            group by 1,2,3,4,5,6
            order by 1,2,3,4,5,6          
          `);
  }

  checkForExistenceText(table, column, value) {
    return pgc.pgdb.query(`select exists (select 1 from ${config.conSchema}.${table} where upper(${column}) = $1 limit 1)`, [value.toUpperCase()])
      .then(results => results.rows[0].exists);
  }

  getSortedUpperListFromColumn(table, column, whereClause?) {
    let query = `select distinct upper(${column}) as col from ${config.conSchema}.${table}`;
    if (whereClause) {
      query += ' where ' + whereClause;
    }
    query += ` order by upper(${column})`;

    return pgc.pgdb.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(results => _.sortBy(results, _.identity));
  }

}
