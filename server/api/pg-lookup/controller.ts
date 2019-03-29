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

  callRepoMethod(req, res, next) {
    const method = this.repo[req.params.method];
    if (!method) {
      throw new ApiError(`PgLookupController: no method found for ${req.params.method}`)
    }
    method.call(this.repo, req)
      .then(docs => res.json(docs))
      .catch(next);
  }

  getRecordset(req, res, next) {
    this.verifyProperties(req.body, ['table', 'column']);
    // shut down where for security risk
    this.repo.getRecordset(req.body.table, req.body.column, null, req.body.isNumber, req.body.upper)
      .then(list => res.json(list))
      .catch(next);
  }

  getListFromColumn(req, res, next) {
    this.verifyProperties(req.body, ['table', 'column']);
    // shut down where for security risk
    this.repo.getListFromColumn(req.body.table, req.body.column, null, req.body.isNumber, req.body.upper)
      .then(list => res.json(list))
      .catch(next);
  }

  getSortedListFromColumn(req, res, next) {
    this.verifyProperties(req.body, ['table', 'column']);
    // shut down where for security risk
    this.repo.getSortedListFromColumn(req.body.table, req.body.column, null, req.body.isNumber)
      .then(list => res.json(list))
      .catch(next);
  }

  getSortedUpperListFromColumn(req, res, next) {
    this.verifyProperties(req.body, ['table', 'column']);
    // shut down where for security risk
    this.repo.getSortedUpperListFromColumn(req.body.table, req.body.column, null)
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

  verifyProperties(data, arr) {
    const missingProps = [];
    arr.forEach(prop => {
      if (!data[prop]) {
        missingProps.push(prop);
      }
    });
    if (missingProps.length) {
      throw new ApiError(`Properties missing: ${missingProps.join(', ')}.`, data, 400);
    }
  }

}

