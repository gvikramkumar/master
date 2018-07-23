import AnyObj from '../../../shared/models/any-obj';
import {Orm, OrmMap} from './Orm';
import {pgc} from '../database/postgres-conn';
import {ApiError} from '../common/api-error';
import * as _ from 'lodash';
import Any = jasmine.Any;

/*
interface PgRow {
  rows: AnyObj[];
}

const date = new Date().toISOString();
function query(a, b?): Promise<PgRow> {
  console.log(a, b);
  return Promise.resolve({rows: [{
      module_id: 5,
      fiscal_month_id: 201809,
      open_flag: 'Y',
      create_owner: 'system',
      create_datetimestamp: date,
      update_owner: 'system',
      update_datetimestamp: date,
    }]});
}

const pgc = {
  pgdb: {query: query}
}
*/

// date assumption: assumes all dates are iso date strings, can't pass in objects with Date types
// passed in filter objects use object properties, not table fields
export class PostgresRepoBase {
  table: string;
  idProp: string;

  constructor(protected orm: Orm, protected isModuleRepo = false) {
  }

  getMany(filter = {}) {
    this.verifyModuleId(filter);
    let sql = 'select ';
    sql += this.orm.maps.map(map => map.field).join(', ');
    sql += ` from ${this.table} `;
    const keys = Object.keys(filter);
    sql += this.buildParameterizedWhereClause(keys, 0, false);
    return pgc.pgdb.query(sql, keys.map(key => filter[key]))
      .then(resp => resp.rows.map(row => this.orm.recordToObject(row)));
  }

  getOne(idVal, errorIfMultiple = true) {
    if (!idVal) {
      throw new ApiError('getOne missing idVal', null, 400);
    }
    return this.getMany({[this.idProp]: idVal})
      .then(objs => {
        if (objs.length > 1 && errorIfMultiple) {
          throw new ApiError('Multiple rows returned from getOne query', null, 400);
        }
        return objs[0];
      });
  }

  // this is NOT paremeterized, no way around that, as we have to upload 5k at a time
  addMany(objs, userId) {
    let sql = ` insert into ${this.table} ( `;
    sql += this.orm.maps.map(map => map.field).join(', ') + ' )\n values ';
    const arrSql = [];
    objs.forEach(obj => {
      const record = this.orm.objectToRecordAdd(obj, userId);
      const str = ' ( ' + this.orm.maps.map(map => this.orm.quote(record[map.field])).join(', ') + ' ) ';
      arrSql.push(str);
    })
    sql += arrSql.join(',\n');
    return pgc.pgdb.query(sql)
      .then(resp => ({rowCount: resp.rowCount}));
  }

  addOne(obj, userId) {
    const record = this.orm.objectToRecordAdd(obj, userId);
    let sql = ` insert into ${this.table} ( `;
    sql += this.orm.maps.map(map => map.field).join(', ') + ' ) values ( ';
    sql += this.orm.maps.map((map, idx) => `$${idx + 1}`).join(', ');
    sql += ' ) returning *';
    return pgc.pgdb.query(sql, this.orm.maps.map(map => record[map.field]))
      .then(resp => this.orm.recordToObject(resp.rows[0]));
  }

  /*
      // how we could do a concurrency check, but we already have one in mongo. This will be needed if objects exist only in postgres
      if (_.find(this.orm.maps, {prop: 'updatedDate'})) {
        filter.updatedDate = obj.updatedDate;
      }
  */
  updateOne(obj, userId, concurrencyCheck = true) {
    const filter = {[this.idProp]: obj[this.idProp]};
    if (_.find(this.orm.maps, {prop: 'updatedDate'}) && concurrencyCheck) {
      filter.updatedDate = obj.updatedDate;
    }
    return this.getMany(filter)
      .then(rows => {
        if (!rows.length) {
          throw new ApiError(`UpdateOne concurrency error. Please refresh your data.`);
        }
        if (rows.length > 1) {
          throw new ApiError(`UpdateOne multiple records found.`, null, 400);
        }
        const record = this.orm.objectToRecordUpdate(obj, userId);
        let queryIdx = 0;
        let sql = ` update ${this.table} set `;
        const setArr = [];
        this.orm.maps.forEach((map, idx) => {
          setArr.push(`${map.field} = $${idx + 1}`);
          queryIdx++;
        });
        sql += setArr.join(', ');
        const keys = Object.keys(filter);
        sql += this.buildParameterizedWhereClause(keys, queryIdx, true);
        sql += ' returning *'
        return pgc.pgdb.query(sql,
          this.orm.maps.map(map => record[map.field]).concat(keys.map(key => filter[key])))
          .then(resp => this.orm.recordToObject(resp.rows[0]));
      });
  }

  removeAll() {
    const sql = `delete from ${this.table}`;
    return pgc.pgdb.query(sql)
      .then(resp => ({rowCount: resp.rowCount}));
  }

  removeMany(filter = {}) {
    let sql = `delete from ${this.table} `;
    const keys = Object.keys(filter);
    if (!keys.length) {
      throw new ApiError('DeleteMany with no filter, use DeleteAll', null, 400);
    }
    sql += this.buildParameterizedWhereClause(keys, 0, true);
    return pgc.pgdb.query(sql, keys.map(key => filter[key]))
      .then(resp => ({rowCount: resp.rowCount}));
  }

  removeOne(idVal) {
    if (!idVal) {
      throw new ApiError('getOne missing idVal', null, 400);
    }
    const filter = {[this.idProp]: idVal};
    return this.getOne(idVal)
      .then(obj => {
        if (!obj) {
          throw new ApiError(`DeleteOne: no record to delete.`, null, 400);
        }
        let sql = `delete from ${this.table} `;
        const keys = Object.keys(filter);
        sql += this.buildParameterizedWhereClause(keys, 0, true);
        sql += ' returning *'
        return pgc.pgdb.query(sql, keys.map(key => filter[key]))
          .then(resp => this.orm.recordToObject(resp.rows[0]));
      });
  }

  buildParameterizedWhereClause(keys, startIndex, errorIfEmpty) {
    let sql = '';
    if (keys.length) {
      sql += ' where ';
      keys.forEach((key, idx) => {
        const map = _.find(this.orm.maps, {prop: key});
        if (!map) {
          throw new ApiError(`No property found in ormMap for ${key}`, null, 400);
        }
        const field = map.field;
        if (idx !== 0) {
          sql += ' and ';
        }
        sql += ` ${field} = $${startIndex + idx + 1} `;
      });
    } else {
      if (errorIfEmpty) {
        throw new ApiError('No filter in postgres query.', null, 400);
      }
    }
    return sql;
  }

  verifyModuleId(filter) {
    if (this.isModuleRepo) {
      if (!filter.moduleId) {
        throw new ApiError(`${this.table} repo call is missing moduleId`, null, 400);
      } else {
        filter.moduleId = Number(filter.moduleId);
      }
    }
  }

  test() {
    const sql = ` insert into fpadfa.dfa_open_period ( 
 module_id, 
 fiscal_month_id, 
 open_flag, 
 create_owner, 
 create_datetimestamp, 
 update_owner, 
 update_datetimestamp ) 
 values ( '5', '201809', 'Y', 'system','2018-07-22T14:47:49.193Z','system','2018-07-22T14:47:49.193Z' ) returning *
`;
    return pgc.pgdb.query(sql)
      .then(resp => this.orm.recordToObject(resp.rows[0]));
  }


}
