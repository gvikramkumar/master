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
  getSubmeasureGroupingReport() {
    return pgc.pgdb.query(`
            select 
            a.sub_measure_name as sub_measure_name,
            b.sub_measure_name as group_sub_measure_name,
            c.create_user,
            c.create_datetime,
            c.update_user,
            c.update_datetime
            from fpadfa.dfa_sub_measure a, fpadfa.dfa_sub_measure b, fpadfa.dfa_submeasure_group c
            where a.sub_measure_key = c.sub_measure_key
            and b.sub_measure_key = c.group_sub_measure_key
          `);
  }

  get2TSebmeasureListReport() {
    return pgc.pgdb.query(`
            select 
            submeasure_name, 
            fiscal_month_id, 
            create_user,
            create_datetime,
            update_user,
            update_datetime
            from fpadfa.dfa_2t_submeasure_list
            where fiscal_month_id in (select fiscal_month_id from fpadfa.dfa_open_period where open_flag = 'Y')
          `);
  }

  getDistiToDirectMappingReport() {
    return pgc.pgdb.query(`
            select 
            group_id, 
            node_type, 
            CASE
              WHEN sales_finance_hierarchy != null THEN sales_finance_hierarchy
              ELSE 'Sales Fin hierarchy'
            end as sales_finance_hierarchy,
            node_code,
            fiscal_month_id,
            create_user,
            create_datetime,
            update_user,
            update_datetime
            from fpadfa.dfa_disti_to_direct_mapping
            where fiscal_month_id in (select fiscal_month_id from fpadfa.dfa_open_period where open_flag = 'Y')
          `);
  }

  getAlternateSL2Report() {
    return pgc.pgdb.query(`
            select 
            actual_sl2_code, 
            alternate_sl2_code, 
            alternate_country_name,
            fiscal_month_id,
            create_user,
            create_datetime,
            update_user,
            update_datetime
            from fpadfa.dfa_scms_triang_altsl2_map
            where fiscal_month_id in (select fiscal_month_id from fpadfa.dfa_open_period where open_flag = 'Y')
          `);
  }

  getCorpAdjustmentReport() {
    return pgc.pgdb.query(`
            select 
            sales_country_name, 
            sales_territory_code, 
            scms_value,
            fiscal_month_id,
            create_user,
            create_datetime,
            update_user,
            update_datetime
            from fpadfa.dfa_scms_triang_corpadj_map
            where fiscal_month_id in (select fiscal_month_id from fpadfa.dfa_open_period where open_flag = 'Y')
          `);
  }

  getSalesSplitPercentageReport() {
    return pgc.pgdb.query(`
            select 
            account_id, 
            company_code, 
            sub_account_code,
            sales_territory_code,
            split_percentage,
            fiscal_month_id,
            create_user,
            create_datetime,
            update_user,
            update_datetime
            from fpadfa.dfa_sales_split_percentage
            where fiscal_month_id in (select fiscal_month_id from fpadfa.dfa_open_period where open_flag = 'Y')
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
