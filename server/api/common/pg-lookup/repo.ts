import {pgc} from '../../../lib/database/postgres-conn';
import _ from 'lodash';
import {injectable} from 'inversify';
import {ApiError} from '../../../lib/common/api-error';


@injectable()
export default class PgLookupRepo {

  constructor() {
  }

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
            from fpacon.vw_fpa_products
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
            from fpacon.vw_fpa_sales_hierarchy
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

  getAdjustmentPFReport() {
    return pgc.pgdb.query(`
            SELECT DISTINCT 
            ph.technology_group_id,
            ph.business_unit_id,
            ph.product_family_id
            FROM fpacon.vw_fpa_products ph
            where 1=1
            AND REPLACE(REPLACE(ph.product_family_id,'_ADJ_PF',''),'_ADJ_BU','')||'_ADJ_PROD' = ph.product_id 
            AND ph.product_id LIKE '%_ADJ_PROD'
            GROUP by 1,2,3
            ORDER by 1,2,3
          `);
  }

  getDriverSL3Report() {
    return pgc.pgdb.query(`
            SELECT
            driver_type,
            sh.l1_sales_territory_name_code,
            sh.l1_sales_territory_descr,
            sh.l2_sales_territory_name_code,
            sh.l2_sales_territory_descr,
            sh.l3_sales_territory_name_code,
            sh.l3_sales_territory_descr 
            FROM
            fpadfa.dfa_prof_driver_data drv,fpacon.vw_fpa_sales_hierarchy sh
            WHERE 1=1
            and drv.fiscal_month_id
            in (SELECT fiscal_year_month_int 
              FROM (SELECT fiscal_year_month_int 
                  FROM fpacon.vw_fpa_fiscal_month_to_year  
                  WHERE fiscal_year_month_int in (SELECT FISCAL_MONTH_ID FROM fpadfa.dfa_open_period WHERE OPEN_FLAG = 'Y' and module_id=1)
                  order by fiscal_year_month_int desc) as fm 
              limit 3)
            and drv.sales_territory_code = sh.sales_territory_type_code
            GROUP BY DRIVER_TYPE, sh.l1_sales_territory_name_code, sh.l1_sales_territory_descr,
            sh.l2_sales_territory_name_code, sh.l2_sales_territory_descr ,
            sh.l3_sales_territory_name_code, sh.l3_sales_territory_descr
            ORDER BY
            DRIVER_TYPE,
            sh.l1_sales_territory_name_code,
            sh.l1_sales_territory_descr,
            sh.l2_sales_territory_name_code,
            sh.l2_sales_territory_descr,
            sh.l3_sales_territory_name_code,
            sh.l3_sales_territory_descr
          `);
  }

  getShipmentDriverPFReport() {
    return pgc.pgdb.query(`
            SELECT 
            product_hier.technology_group_id,
            product_hier.business_unit_id,
            product_hier.product_family_id 
            FROM 
            (SELECT product_family
            FROM fpadfa.dfa_prof_driver_data drv
            WHERE fiscal_month_id in 
            (SELECT fiscal_year_month_int 
              FROM (SELECT fiscal_year_month_int 
                  FROM fpacon.vw_fpa_fiscal_month_to_year  
                  WHERE fiscal_year_month_int in (SELECT FISCAL_MONTH_ID FROM fpadfa.dfa_open_period WHERE OPEN_FLAG = 'Y' and module_id=1)
                  order by fiscal_year_month_int desc) as fm 
              limit 3)
            and driver_type ='SHIPMENT' 
            group by product_family
            having sum(usd_ext_selling_price)<>0) driver,
            (SELECT ph.technology_group_id, 
              ph.business_unit_id,
              ph.product_family_id
              FROM fpacon.vw_fpa_products ph 
              WHERE REPLACE(REPLACE(ph.product_family_id,'_ADJ_PF',''),'_ADJ_BU','')||'_ADJ_PROD'=ph.product_id
              and ph.product_id like '%_ADJ_PROD' 
              group by ph.technology_group_id, ph.business_unit_id,ph.product_family_id) product_hier
            WHERE driver.PRODUCT_FAMILY = product_hier.product_family_id 
            order by product_hier.technology_group_id,product_hier.business_unit_id, product_hier.product_family_id
          `);
  }

  getRoll3DriverWithBEReport() {
    return pgc.pgdb.query(`
            SELECT 
            driver.driver_type,
            product_hier.technology_group_id,
            product_hier.business_unit_id,
            product_hier.product_family_id,
            driver.bk_business_entity_name,
            driver.sub_business_entity_name
            FROM 
            (SELECT driver_type,
            product_family,
            bk_business_entity_name,
            sub_business_entity_name
            FROM fpadfa.dfa_prof_driver_data drv
            WHERE fiscal_month_id in
            (SELECT fiscal_year_month_int 
              FROM (SELECT fiscal_year_month_int 
                  FROM fpacon.vw_fpa_fiscal_month_to_year  
                  WHERE fiscal_year_month_int in (SELECT FISCAL_MONTH_ID FROM fpadfa.dfa_open_period WHERE OPEN_FLAG = 'Y' and module_id=1)
                  order by fiscal_year_month_int desc) as fm 
              limit 3)
            and driver_type in ('SHIPMENT','GLREV','REMKTREV')
            and (COALESCE( USD_EXT_SELLING_PRICE, 0)!=0 or COALESCE(USD_EXT_GROSS_REVENUE,0)!=0 or COALESCE(usd_ext_cmdm_amount, 0)!= 0)
            group by driver_type, product_family, bk_business_entity_name,sub_business_entity_name) driver,
            (SELECT ph.technology_group_id, 
              ph.business_unit_id,
              ph.product_family_id
              FROM fpacon.vw_fpa_products ph 
              WHERE REPLACE(REPLACE(ph.product_family_id,'_ADJ_PF',''),'_ADJ_BU','')||'_ADJ_PROD'=ph.product_id
              and ph.product_id like '%_ADJ_PROD' 
              group by ph.technology_group_id, ph.business_unit_id,ph.product_family_id) product_hier 
            WHERE driver.PRODUCT_FAMILY = product_hier.product_family_id 
            order by DRIVER_TYPE, product_hier.technology_group_id,product_hier.business_unit_id, product_hier.product_family_id
          `);
  }


  checkForExistenceAndReturnValue(table, column, value, upper = true) {
    if (!value && value !== 0) {
      throw new ApiError('checkForExistenceAndReturnValue: undefined or null value', null, 400);
    }
    let val;
    let sql = `select ${column} as col from ${table} where `; // ${column} = $1 limit 1) as exists`
    if (upper) {
      sql += ` upper(${column}) = $1 limit 1`;
      val = value.toUpperCase();
    } else {
      sql += ` ${column} = $1 limit 1`;
      val = value;
    }
    return pgc.pgdb.query(sql, [val])
      .then(results => {
        if (results.rows.length === 0) {
          return null;
        } else {
          return results.rows[0].col;
        }
      });
  }

  checkForExistenceValue(table, column, value, upper = true) {
    if (!value && value !== 0) {
      throw new ApiError('checkForExistenceAndReturnValue: undefined or null value', null, 400);
    }
    let val;
    let sql = `select exists (select 1 from ${table} where `; // ${column} = $1 limit 1) as exists`
    if (upper) {
      sql += ` upper(${column}) = $1 limit 1) as exists`;
      val = value.toUpperCase();
    } else {
      sql += ` ${column} = $1 limit 1) as exists`;
      val = value;
    }
    return pgc.pgdb.query(sql, [val])
      .then(results => results.rows[0].exists);
  }

  checkForExistenceArray(table, column, arr, upper = true): Promise<{values: any[], exist: boolean}> {
    if (!arr.length) {
      throw new ApiError('checkForExistenceArray: empty array', null, 400);
    }
    arr.forEach(val => {
      if (val === undefined || val === null) {
        throw new ApiError('checkForExistenceArray: undefined or null value', null, 400);
      }
    })
    const promises = [];
    arr.forEach(val => {
      promises.push(this.checkForExistenceAndReturnValue(table, column, val, upper));
    });
    return Promise.all(promises)
      .then(results => {
        return {values: results, exist: !results.filter(x => x === null).length};
      });
  }

  selectWhereIn(table, column, arr, conditional: 'in'|'not in' = 'in') {
    if (!arr.length) {
      throw new ApiError('selectWhereIn: empty array', null, 400);
    }
    const vars = arr.map((x, idx) => `$${idx + 1}`).join(',');
    const sql = `select * from ${table} where ${column} ${conditional} ( ${vars} )`;
    return pgc.pgdb.query(sql, arr)
      .then(results => results.rows);
  }

  selectWhereInUpper(table, column, arr) {
    if (!arr.length) {
      throw new ApiError('selectWhereIn: empty array', null, 400);
    }
    const vars = arr.map((x, idx) => `$${idx + 1}`).join(',');
    const sql = `select * from ${table} where upper(${column}) in ( ${vars} )`;
    return pgc.pgdb.query(sql, arr.map(x => x.toUpperCase()))
      .then(results => results.rows);
  }

  getSortedListFromColumn(table, column, whereClause?) {
    let query = `select distinct ${column} as col from ${table}`;
    if (whereClause) {
      query += ' where ' + whereClause;
    }
    query += ` order by ${column}`;

    return pgc.pgdb.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(vals => _.sortBy(vals, _.identity));
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

  verifyExistence

}
