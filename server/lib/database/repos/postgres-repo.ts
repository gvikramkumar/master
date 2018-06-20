import {pgc} from '../postgres-conn';
import _config from '../../../config/get-config';
import _ from 'lodash';

const config = _config.postgres;
const db = pgc.pgdb;

export default class PostgresRepo {


  getProductHierarchyReport() {
    return db.query(`
            select 
            technology_group_id, 
            business_unit_id, 
            product_family_id
            from ${config.schema}.vw_fds_products
            group by 1,2,3 order by 1,2,3    
          `);
  }

  getSalesHierarchyReport() {
    return db.query(`
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
    return db.query(`select exists (select 1 from ${config.schema}.${table} where upper(${column}) = $1 limit 1)`, [value.toUpperCase()])
      .then(results => results.rows[0].exists);
  }

  getSortedUpperListFromColumn(table, column, whereClause?) {
    let query = `select distinct upper(${column}) as col from ${config.schema}.${table}`;
    if (whereClause) {
      query += ' where ' + whereClause;
    }
    query += ` order by upper(${column})`;

    return db.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(results => _.sortBy(results, _.identity));
  }

}
