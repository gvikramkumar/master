import {injectable} from 'inversify';
import {ApiError} from '../../../lib/common/api-error';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import {PostgresLookupRepo} from './repo';


@injectable()
export class PostgresLookupController {

  constructor(private repo: PostgresLookupRepo) {
    const i = 5;
  }

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


  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400);
      }
    });
  }

}

