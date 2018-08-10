import {injectable} from 'inversify';
import {ApiError} from '../../../lib/common/api-error';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import {PostgresRepoBase} from '../../../lib/base-classes/pg-repo-base';
import PostgresRepo from './postgres-repo';


@injectable()
export class PgLookupController {

  constructor(private repo: PostgresRepo) {
  }

  // post /call-method/:method
  callMethod(req, res, next) {
    const method = this[req.params.method];
    if (!method) {
      throw new ApiError(`PostgresLookupController: no method found for ${req.params.method}`)
    }
    method.call(this, req, res, next);
  }

  getFiscalMonths(req, res, next) {
    const maps: OrmMap[] = [
      {prop: 'fiscalMonthName', field: 'fiscal_month_name'},
      {prop: 'fiscalMonth', field: 'fiscal_year_month_int', type: OrmTypes.number},
    ] ;
    const orm = new Orm(maps);
    this.repo.getFiscalMonths()
      .then(resp => res.json(resp.rows.map(record => orm.recordToObject(record))))
      .catch(next);
  }

  /*
  sales >> sl1 only
product >> tg only
legal entity??
internal be be/sub be (not sure page will work well with 100 choices in dropdown)

   */

  getRuleCriteriaChoicesSalesLevel1(req, res, next) {
    this.repo.getSortedListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l1_sales_territory_descr')
      .then(arr => res.json(arr))
      .catch(next);
  }

  getRuleCriteriaChoicesProdTg(req, res, next) {
    this.repo.getSortedListFromColumn('fpacon.vw_fpa_products', 'technology_group_id')
      .then(arr => res.json(arr))
      .catch(next);
  }

  getRuleCriteriaChoicesScms(req, res, next) {
    this.repo.getSortedListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code')
      .then(arr => res.json(arr))
      .catch(next);
  }

  getRuleCriteriaChoicesInternalBeBe(req, res, next) {
    this.repo.getSortedListFromColumn('fpacon.vw_fpa_be_hierarchy', 'business_entity_descr')
      .then(arr => res.json(arr))
      .catch(next);
  }

  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400);
      }
    });
  }

}

