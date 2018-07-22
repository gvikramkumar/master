import {pgc} from '../postgres-conn';
import _ from 'lodash';
import {injectable} from 'inversify';


@injectable()
export default class PostgresRepo {

  constructor() {
  }

  // get: JUL FY2018	, 201812 for this year and last in descending order (latest to earliest)
  getFiscalMonths() {
    return pgc.pgdb.query(`
            select fiscal_month_name, fiscal_year_month_int from
            fpacon.vw_fpa_fiscal_month_to_year
            where fiscal_year_age between 0 and 1
            order by fiscal_year_month_int desc
          `);
  }

  getProductHierarchyReport() {
    return pgc.pgdb.query(`
            select 
            technology_group_id, 
            business_unit_id, 
            product_family_id
            from fpacon.vw_fds_products
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
    return pgc.pgdb.query(`select exists (select 1 from ${table} where upper(${column}) = $1 limit 1)`, [value.toUpperCase()])
      .then(results => results.rows[0].exists);
  }

  getSortedUpperListFromColumn(table, column, whereClause?) {
    let query = `select distinct upper(${column}) as col from ${table}`;
    if (whereClause) {
      query += ' where ' + whereClause;
    }
    query += ` order by upper(${column})`;

    return pgc.pgdb.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(vals => _.sortBy(vals, _.identity));
  }

}
