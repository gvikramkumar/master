import {pgc} from '../../lib/database/postgres-conn';
import _ from 'lodash';
import {injectable} from 'inversify';
import {ApiError} from '../../lib/common/api-error';




@injectable()
export default class PgLookupRepo {

  constructor() {
  }

  getDbVersion() {
    return pgc.pgdb.query('select version()')
      .then(results => results.rows[0].version);
  }

  getFiscalMonths() {
    return pgc.pgdb.query(`
            select fiscal_month_name, fiscal_year_month_int from
            fpacon.vw_fpa_fiscal_month_to_year
            where fiscal_year_age between 0 and 1
            order by fiscal_year_month_int desc
          `);
  }

/*
// this was taking too long to replace the dollar/mapping/dept upload reports with pg only solutions
// i.e. getting submeasure.name from pg instead of mongo
  getDollarUploadReport(params) {
    return pgc.pgdb.query(`
            select fiscal_month_id, sm.sub_measure_name, input_product_value, input_sales_value, 
              input_entity_value, input_internal_be_value, input_scms_value, amount_value
            from fpadfa.dfa_prof_input_amnt_upld up
            left outer join fpadfa.dfa_sub_measure sm on up.sub_measure_key = sm.sub_measure_key
            where fiscal_month_id = ${params.fiscalMonth} and up.sub_measure_key = ${params.submeasureKey};
            `);

  }
*/

  // not used anymore. This was used to get submeasure sourceSystemAdjTypeId description, but they pulled that column out of reports, so desc went too
  getAdjustmentTypeIdDesc() {
    return pgc.pgdb.query('select source_system_id, adj_type_id, adj_type_description from fpadfa.dfa_prof_source_adj_type_all')
      .then(resp => resp.rows.map(x => {
        x.source_system_id = Number(x.source_system_id);
        x.adj_type_id = Number(x.adj_type_id);
        return x;
      }));
  }

  getSubmeasurePNLNodes (req) {
    const sql = `
            select 
            distinct sm.measure_id::integer, ms.measure_name, sm.pnlnode_grouping 
            from fpadfa.dfa_sub_measure sm, fpadfa.dfa_measure ms 
            where sm.module_id=${Number(req.query.moduleId)} and ms.measure_id=sm.measure_id and sm.pnlnode_grouping is not null
            order by sm.measure_id::integer, ms.measure_name, sm.pnlnode_grouping;
          `;
    return pgc.pgdb.query(sql)
      .then(results => results.rows);
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

  getCountryNamesFromSalesHierarchy() {
    return pgc.pgdb.query(`
            select cntry.iso_country_name
            from fpacon.vw_fpa_iso_country cntry
            ,fpacon.vw_fpa_sales_hierarchy dsh
            where 1=1
            and dsh.iso_country_code=cntry.bk_iso_country_code
            group by 1;
          `)
      .then(resp => resp.rows.map(x => x.iso_country_name));
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
            sbm.sub_measure_name,
            group1.group_sub_measure_name,
            sbm.create_owner,
            sbm.create_datetimestamp,
            sbm.update_owner,
            sbm.update_datetimestamp
            from 
              fpadfa.dfa_sub_measure sbm,
              (select distinct a.grouped_by_smeasure_key as groupkey,
                  b.sub_measure_name as group_sub_measure_name
                  from fpadfa.dfa_sub_measure a, fpadfa.dfa_sub_measure b
                  where 1=1
                  and a.grouped_by_smeasure_key is not null
                  and a.grouped_by_smeasure_key = b.sub_measure_key) group1
            where 1=1
            and sbm.grouped_by_smeasure_key is not null
            and sbm.grouped_by_smeasure_key=group1.groupkey
          `);
  }

  get2TSebmeasureListReport(fiscalMonth) {
    return pgc.pgdb.query(`
            select 
            sub_measure_name, 
            ${fiscalMonth} as fiscal_month_id, 
            create_owner,
            create_datetimestamp,
            update_owner,
            update_datetimestamp
            from fpadfa.dfa_sub_measure
            where twotier_flag = 'Y'
          `);
  }

  getDistiToDirectMappingReport() {
    return pgc.pgdb.query(`
            select 
            group_id, 
            node_type, 
            CASE
              WHEN sales_finance_hierarchy != null THEN sales_finance_hierarchy
              ELSE 'Sales Fin Hierarchy'
            end as sales_finance_hierarchy,
            node_code,
            ext_theater_name,
            fiscal_month_id,
            create_owner,
            create_datetimestamp,
            update_owner,
            update_datetimestamp
            from fpadfa.dfa_prof_disti_to_direct_map_upld            
            where fiscal_month_id in (select fiscal_month_id from fpadfa.dfa_open_period                               
                                                      where module_id =1 and open_flag = 'Y')              
          `);
  }

  getAlternateSL2Report(fiscalMonth) {
    return pgc.pgdb.query(`
            select 
            actual_sl2_code, 
            alternate_sl2_code, 
            alternate_country_name,
            fiscal_month_id,
            create_owner,
            create_datetimestamp,
            update_owner,
            update_datetimestamp
            from fpadfa.dfa_prof_scms_triang_altsl2_map_upld
            where fiscal_month_id = ${fiscalMonth}
          `);
  }

  getCorpAdjustmentReport(fiscalMonth) {
    return pgc.pgdb.query(`
            select 
            sales_country_name, 
            sales_territory_code, 
            scms_value,
            fiscal_month_id,
            create_owner,
            create_datetimestamp,
            update_owner,
            update_datetimestamp
            from fpadfa.dfa_prof_scms_triang_corpadj_map_upld
            where fiscal_month_id = ${fiscalMonth}
          `);
  }

  getSalesSplitPercentageReport(fiscalMonth) {
    return pgc.pgdb.query(`
            select  
            account_code, 
            company_code, 
            sub_account_code,
            sales_territory_code,
            split_percentage,
            fiscal_month_id,
            create_owner,
            create_datetimestamp,
            update_owner,
            update_datetimestamp
            from fpadfa.dfa_prof_sales_split_pctmap_upld
            where fiscal_month_id = ${fiscalMonth}
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

  getSubmeasureFlashCategories(req) {
    // this must be called with a submeasureKey = 0 (new submeasure) or the submeasureKey
    // if 0, then get the list of available values minus those taken already. If not 0, then get the value it's using added to the list of available
    const sql = `
        select a.adj_type_id_name||' - '||a.adj_type_id as mrap_category_id, a.adj_type_id::integer
                from
                (             
                select distinct 
                                 ds.source_system_id source_system_id, ds.source_system_name source_system_name
                                ,ad.adj_type_id adj_type_id, upper(ad.adj_type_id_name) adj_type_id_name
                               from
                                 fpadfa.dfa_measure ms
                                ,fpadfa.dfa_sub_measure sm
                                ,fpadfa.dfa_prof_source_adj_type_all ad right join
                                  fpadfa.dfa_data_sources ds on ds.source_system_id = ad.source_system_id
                   where
                           ms.measure_id = sm.measure_id
                    and sm.source_system_id = ds.source_system_id
                    and ds.module_id=1
                    and ms.measure_id=3
                    and sm.source_system_id <> 4   
                    and ds.status_flag = 'A'              
                    except 
                                select 
                                 sm.source_system_id source_system_id, ds.source_system_name source_system_name
                                ,adj.adj_type_id adj_type_id, UPPER(adj.adj_type_id_name) adj_type_id_name
                               from 
                                 fpadfa.dfa_sub_measure sm
                               ,fpadfa.dfa_data_sources ds
                               ,fpadfa.dfa_prof_source_adj_type_all adj
                   where 
                           sm.source_system_id=ds.source_system_id                                       
                    and sm.source_system_id=adj.source_system_id                                         
                    and sm.source_system_adj_type_id=adj.adj_type_id 
                    and ds.module_id=1
                   and sm.measure_id=3                                  
                    and sm.source_system_id <> 4                                         
                    and sm.status_flag='A'                                   
            union
                    select 
                                 sm.source_system_id source_system_id, ds.source_system_name source_system_name
                                ,adj.adj_type_id adj_type_id, UPPER(adj.adj_type_id_name) adj_type_id_name
                               from 
                                 fpadfa.dfa_sub_measure sm
                               ,fpadfa.dfa_data_sources ds
                               ,fpadfa.dfa_prof_source_adj_type_all adj
                   where 
                           sm.source_system_id=ds.source_system_id                                       
                    and sm.source_system_id=adj.source_system_id                                         
                    and sm.source_system_adj_type_id=adj.adj_type_id
                   and ds.module_id=1
                   and sm.measure_id=3                                   
                    and sm.source_system_id <> 4                                         
                    and sm.sub_measure_key = ${Number(req.query.submeasureKey)}
--                 sm.sub_measure_key = 0 /* for any new sub-measure creation, pass 0 as a parameter */        
--                 or sm.sub_measure_key = $$sub_measure_key /* for existing sub-measure update, pass sub-measure-key as a parameter */
            ) a
        where a.adj_type_id_name||' - '||a.adj_type_id is not null
        order by a.adj_type_id_name||' - '||a.adj_type_id
    `;
    return pgc.pgdb.query(sql)
      .then(resp => resp.rows);
  }

  getSubmeasureAdjustmentTypes(req) {
    // this must be called with a submeasureKey = 0 (new submeasure) or the submeasureKey
    // if 0, then get the list of available values minus those taken already. If not 0, then get the value it's using added to the list of available
    const sql = `
        select a.adj_type_id_name||' - '||a.adj_type_id as rrr_category_id, a.adj_type_id::integer
                from
                (             
                select distinct 
                                 ds.source_system_id source_system_id, ds.source_system_name source_system_name
                                ,ad.adj_type_id adj_type_id, upper(ad.adj_type_id_name) adj_type_id_name
                               from
                                 fpadfa.dfa_measure ms
                                ,fpadfa.dfa_sub_measure sm
                                ,fpadfa.dfa_prof_source_adj_type_all ad right join
                                  fpadfa.dfa_data_sources ds on ds.source_system_id = ad.source_system_id
                   where
                           ms.measure_id = sm.measure_id
                    and sm.source_system_id = ds.source_system_id
                    and ms.measure_id=1
                    and sm.source_system_id <> 4   
                    and ds.status_flag = 'A'              
                    except 
                                select 
                                 sm.source_system_id source_system_id, ds.source_system_name source_system_name
                                ,adj.adj_type_id adj_type_id, UPPER(adj.adj_type_id_name) adj_type_id_name
                               from 
                                 fpadfa.dfa_sub_measure sm
                               ,fpadfa.dfa_data_sources ds
                               ,fpadfa.dfa_prof_source_adj_type_all adj
                   where 
                           sm.source_system_id=ds.source_system_id                                       
                    and sm.source_system_id=adj.source_system_id                                         
                    and sm.source_system_adj_type_id=adj.adj_type_id                                         
                    and sm.measure_id=1                                    
                    and sm.source_system_id <> 4                                         
                    and sm.status_flag='A'                                   
            union
                    select 
                                 sm.source_system_id source_system_id, ds.source_system_name source_system_name
                                ,adj.adj_type_id adj_type_id, UPPER(adj.adj_type_id_name) adj_type_id_name
                               from 
                                 fpadfa.dfa_sub_measure sm
                               ,fpadfa.dfa_data_sources ds
                               ,fpadfa.dfa_prof_source_adj_type_all adj
                   where 
                           sm.source_system_id=ds.source_system_id                                       
                    and sm.source_system_id=adj.source_system_id                                         
                    and sm.source_system_adj_type_id=adj.adj_type_id                                         
                    and sm.measure_id=1                                    
                    and sm.source_system_id <> 4                                         
                            and sm.sub_measure_key = ${Number(req.query.submeasureKey)}
        --                 sm.sub_measure_key = 0 /* for any new sub-measure creation, pass 0 as a parameter */        
        --                 or sm.sub_measure_key = $$sub_measure_key /* for existing sub-measure update, pass sub-measure-key as a parameter */
            ) a
        where a.adj_type_id_name||' - '||a.adj_type_id is not null
        order by a.adj_type_id_name||' - '||a.adj_type_id
    `;
    return pgc.pgdb.query(sql)
      .then(resp => resp.rows);
  }

  updateDistiUploadExtTheaterNameDistiSL3(fiscalMonth) {
    return pgc.pgdb.query(`
        update  fpadfa.dfa_prof_disti_to_direct_map_upld
        set ext_theater_name = distimap.external_theater
        from (select D2D.node_code as distinode
        ,case dsh.dd_external_theater_name
        when 'APJC' then 'APJC'
        when 'Americas' then 'Americas'
        when 'EMEA' then 'EMEA' end as external_theater
        from  fpadfa.dfa_prof_disti_to_direct_map_upld D2D
        ,fpacon.vw_fpa_sales_hierarchy dsh
        where 1=1
        and D2D.fiscal_month_id = ${fiscalMonth}
        and D2D.node_type = 'Disti SL3'
        and D2D.node_code = DSH.l3_sales_territory_name_code
        group by 1,2) distimap
        where 1=1
        and fpadfa.dfa_prof_disti_to_direct_map_upld.fiscal_month_id = ${fiscalMonth}
        and fpadfa.dfa_prof_disti_to_direct_map_upld.node_type='Disti SL3'
        and fpadfa.dfa_prof_disti_to_direct_map_upld.node_code = distimap.distinode
    `);
  }

  updateDistiUploadExtTheaterNameDirectSL2(fiscalMonth) {
    return pgc.pgdb.query(`
        update  fpadfa.dfa_prof_disti_to_direct_map_upld
        set ext_theater_name = distimap.external_theater
        from (select D2D.node_code as distinode
        ,case dsh.l1_sales_territory_descr
        when 'APJC__' then 'APJC'
        when 'Americas' then 'Americas'
        when 'EMEAR-REGION' then 'EMEA'
        when 'GLOBAL SERVICE PROVIDER' then 'Americas' end as external_theater
        from  fpadfa.dfa_prof_disti_to_direct_map_upld D2D
        ,fpacon.vw_fpa_sales_hierarchy dsh
        where 1=1
        and D2D.fiscal_month_id = ${fiscalMonth}
        and D2D.node_type = 'Direct SL2'
        and D2D.node_code = DSH.l2_sales_territory_name_code
        group by 1,2) distimap
        where 1=1
        and fpadfa.dfa_prof_disti_to_direct_map_upld.fiscal_month_id = ${fiscalMonth}
        and fpadfa.dfa_prof_disti_to_direct_map_upld.node_type='Direct SL2'
        and fpadfa.dfa_prof_disti_to_direct_map_upld.node_code = distimap.distinode
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

  getSortedListFromColumn(table, column, whereClause?, isNumber?) {
    let query = `select distinct ${column} as col from ${table}`;
    if (whereClause) {
      query += ` where ${whereClause} and ${column} is not null `;
    } else {
      query += ` where ${column} is not null `;
    }
    query += ` order by ${column}`;

    return pgc.pgdb.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(vals => isNumber ? vals.map(val => Number(val)) : vals)
      .then(vals => _.sortBy(vals, _.identity));
  }

  getSortedUpperListFromColumn(table, column, whereClause?) {
    let query = `select distinct upper(${column}) as col from ${table}`;
    if (whereClause) {
      query += ` where ${whereClause} and ${column} is not null `;
    } else {
      query += ` where ${column} is not null `;
    }
    query += ` order by upper(${column})`;

    return pgc.pgdb.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(vals => _.sortBy(vals, _.identity));
  }


  verifyNodeValueInPlOrMgmtHierarchies(nodeValue): Promise<boolean> {
    const sqlPlHierarchy = `
      SELECT DISTINCT column_name
      FROM (SELECT (CASE
      WHEN node_level01_value = '${nodeValue}'
      THEN
      'NODE_LEVEL01_VALUE'
      WHEN node_level02_value = '${nodeValue}'
      THEN
      'NODE_LEVEL02_VALUE'
      WHEN node_level03_value = '${nodeValue}'
      THEN
      'NODE_LEVEL03_VALUE'
      WHEN node_level04_value = '${nodeValue}'
      THEN
      'NODE_LEVEL04_VALUE'
      WHEN node_level05_value = '${nodeValue}'
      THEN
      'NODE_LEVEL05_VALUE'
      WHEN node_level06_value = '${nodeValue}'
      THEN
      'NODE_LEVEL06_VALUE'
      WHEN node_level07_value = '${nodeValue}'
      THEN
      'NODE_LEVEL07_VALUE'
      WHEN node_level08_value = '${nodeValue}'
      THEN
      'NODE_LEVEL08_VALUE'
      WHEN node_level09_value = '${nodeValue}'
      THEN
      'NODE_LEVEL09_VALUE'
      WHEN node_level10_value = '${nodeValue}'
      THEN
      'NODE_LEVEL10_VALUE'
      WHEN node_level11_value = '${nodeValue}'
      THEN
      'NODE_LEVEL11_VALUE'
      WHEN node_level12_value = '${nodeValue}'
      THEN
      'NODE_LEVEL12_VALUE'
      WHEN node_level13_value = '${nodeValue}'
      THEN
      'NODE_LEVEL13_VALUE'
      WHEN node_level14_value = '${nodeValue}'
      THEN
      'NODE_LEVEL14_VALUE'
      WHEN node_level15_value = '${nodeValue}'
      THEN
      'NODE_LEVEL15_VALUE'
      ELSE
      NULL
      END)
      as column_name
      FROM fpacon.vw_fpa_pl_hierarchy) t where column_name is not null;
`;
    const sqlMgmtHierarchy = `
      SELECT DISTINCT column_name
      FROM (SELECT (CASE
      WHEN node_level01_value = '${nodeValue}'
      THEN
      'NODE_LEVEL01_VALUE'
      WHEN node_level02_value = '${nodeValue}'
      THEN
      'NODE_LEVEL02_VALUE'
      WHEN node_level03_value = '${nodeValue}'
      THEN
      'NODE_LEVEL03_VALUE'
      WHEN node_level04_value = '${nodeValue}'
      THEN
      'NODE_LEVEL04_VALUE'
      WHEN node_level05_value = '${nodeValue}'
      THEN
      'NODE_LEVEL05_VALUE'
      WHEN node_level06_value = '${nodeValue}'
      THEN
      'NODE_LEVEL06_VALUE'
      WHEN node_level07_value = '${nodeValue}'
      THEN
      'NODE_LEVEL07_VALUE'
      WHEN node_level08_value = '${nodeValue}'
      THEN
      'NODE_LEVEL08_VALUE'
      WHEN node_level09_value = '${nodeValue}'
      THEN
      'NODE_LEVEL09_VALUE'
      WHEN node_level10_value = '${nodeValue}'
      THEN
      'NODE_LEVEL10_VALUE'
      WHEN node_level11_value = '${nodeValue}'
      THEN
      'NODE_LEVEL11_VALUE'
      WHEN node_level12_value = '${nodeValue}'
      THEN
      'NODE_LEVEL12_VALUE'
      WHEN node_level13_value = '${nodeValue}'
      THEN
      'NODE_LEVEL13_VALUE'
      WHEN node_level14_value = '${nodeValue}'
      THEN
      'NODE_LEVEL14_VALUE'
      WHEN node_level15_value = '${nodeValue}'
      THEN
      'NODE_LEVEL15_VALUE'
      ELSE
      NULL
      END)
      as column_name
      FROM fpacon.vw_fpa_management_hierarchy) t where column_name is not null;
`;

    return pgc.pgdb.query(sqlPlHierarchy)
      .then(results => results.rows[0] && results.rows[0].column_name)
      .then(valid => {
        if (valid) {
          return true;
        } else {
          return pgc.pgdb.query(sqlMgmtHierarchy)
            .then(results => Boolean(results.rows[0] && results.rows[0].column_name));
        }
      });
  }

}
