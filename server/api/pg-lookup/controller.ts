import {injectable} from 'inversify';
import {ApiError} from '../../lib/common/api-error';
import {Orm, OrmMap, OrmTypes} from '../../lib/base-classes/Orm';
import {PgRepoBase} from '../../lib/base-classes/pg-repo-base';
import PgLookupRepo from './repo';


@injectable()
export class PgLookupController {

  constructor(private repo: PgLookupRepo) {
  }

  // post /call-method/:method
  callMethod(req, res, next) {
    const method = this[req.params.method];
    if (!method) {
      throw new ApiError(`PgLookupController: no method found for ${req.params.method}`)
    }
    method.call(this, req, res, next);
  }

  getSortedListFromColumn(req, res, next) {
    this.repo.getSortedListFromColumn(req.body.table, req.body.column, req.body.where, req.body.isNumber)
      .then(list => res.json(list))
      .catch(next);
  }

  getSortedUpperListFromColumn(req, res, next) {
    this.repo.getSortedUpperListFromColumn(req.body.table, req.body.column, req.body.where)
      .then(list => res.json(list))
      .catch(next);
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

  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400);
      }
    });
  }

}

