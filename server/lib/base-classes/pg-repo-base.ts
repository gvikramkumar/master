import AnyObj from '../../../shared/models/any-obj';
import {Orm, OrmMap} from './Orm';
import {pgc} from '../database/postgres-conn';
import {ApiError} from '../common/api-error';
import * as _ from 'lodash';

// date assumption: assumes all dates are iso date strings, can't pass in objects with Date types
// passed in filter objects use object properties, not table fields
export class PgRepoBase {
  table: string;
  idProp: string;

  constructor(protected orm: Orm, protected isModuleRepo = false) {
  }

  getMany(filter: AnyObj = {}) {
    this.verifyModuleId(filter);
    const sortBy = filter.setSort;
    filter = _.omit(filter, ['setSort']);
    let sql = 'select ';
    sql += this.orm.maps.map(map => map.field).join(', ');
    sql += ` from ${this.table} `;
    const keys = Object.keys(filter);
    sql += this.buildParameterizedWhereClause(keys, 0, false);
    if (sortBy) {
      sql += ` order by ${sortBy}`;
    }
    return pgc.pgdb.query(sql, this.getFilterValues(keys, filter))
      .then(resp => resp.rows.map(row => this.orm.recordToObject(row)));
  }

  getManyActive(filter: AnyObj = {}) {
    filter.status = 'A';
    return this.getMany(filter);
  }

  getManyPending(filter: AnyObj = {}) {
    filter.status = 'P';
    return this.getMany(filter);
  }

  getOneById(idVal) {
    return this.getMany({[this.idProp]: idVal})
      .then(objs => {
        if (objs.length > 1) {
          throw new ApiError('Multiple rows returned from getOne query', null, 400);
        }
        return objs[0];
      });
  }

  getId(data) {
    return data[this.idProp];
  }

  // this is NOT paremeterized, no way around that, as we have to upload 5k at a time
  addMany(objs, userId) {
    if (!objs.length) {
      return Promise.resolve({rowCount: 0});
    }
    let sql = ` insert into ${this.table} ( `;
    sql += this.orm.mapsNoSerial.map(map => map.field).join(', ') + ' )\n values ';
    const arrSql = [];
    objs.forEach(obj => {
      const record = this.orm.objectToRecordAdd(obj, userId);
      const str = ' ( ' + this.orm.mapsNoSerial.map(map => this.orm.quote(record[map.field])).join(', ') + ' ) ';
      arrSql.push(str);
    })
    sql += arrSql.join(',\n');
    return pgc.pgdb.query(sql)
      .then(resp => ({rowCount: resp.rowCount}));
  }

  addOne(obj, userId) {
    const record = this.orm.objectToRecordAdd(obj, userId);
    let sql = ` insert into ${this.table} ( `;
    sql += this.orm.mapsNoSerial.map(map => map.field).join(', ') + ' ) values ( ';
    sql += this.orm.mapsNoSerial.map((map, idx) => `$${idx + 1}`).join(', ');
    sql += ' ) returning *';
    return pgc.pgdb.query(sql, this.orm.mapsNoSerial.map(map => record[map.field]))
      .then(resp => this.orm.recordToObject(resp.rows[0]));
  }

  updateOneById(obj, userId, concurrencyCheck?) {
    const filter = {[this.idProp]: obj[this.idProp]};
    return this.updateQueryOne(filter, obj, userId, concurrencyCheck);
  }
  /*
  concurrencyCheck:
  currently we allow updating to both mongo and pg. Both repos have the ability to update updatedDate.
  which means both will be at slightly different dates. the pg repo handles the pg only case so must
  always updates the updatedDate. What to do? We'll allow turning off the concurrency check in this case,
  so if pg only, then on, and if mongo and pg then off.
   */
  updateQueryOne(filter, obj, userId, concurrencyCheck = true) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('updateQueryOne called with no filter', null, 400);
    }
    if (this.hasCreatedBy() && concurrencyCheck) {
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
        this.addUpdatedBy(obj, userId)
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
          this.orm.maps.map(map => this.orm.getPgValue(null, map.field, record[map.field]))
            .concat(this.getFilterValues(keys, filter)))
          .then(resp => this.orm.recordToObject(resp.rows[0]));
      });
  }

  removeManyByIds(ids) {
    if (!ids.length) {
      return Promise.resolve();
    }
    let sql = `delete from ${this.table} `;
    sql += this.buildIdsWhereClause(ids);
    return pgc.pgdb.query(sql);
  }

  removeMany(filter = {}, errorIfEmpty = true) {
    let sql = `delete from ${this.table} `;
    const keys = Object.keys(filter);
    sql += this.buildParameterizedWhereClause(keys, 0, errorIfEmpty);
    return pgc.pgdb.query(sql, this.getFilterValues(keys, filter))
      .then(resp => ({rowCount: resp.rowCount}));
  }

  removeOne(idVal) {
    const filter = {[this.idProp]: idVal};
    return this.getOneById(idVal)
      .then(obj => {
        if (!obj) {
          throw new ApiError(`removeOne: no record to delete.`, null, 400);
        }
        let sql = `delete from ${this.table} `;
        const keys = Object.keys(filter);
        sql += this.buildParameterizedWhereClause(keys, 0, true);
        sql += ' returning *'
        return pgc.pgdb.query(sql, this.getFilterValues(keys, filter))
          .then(resp => this.orm.recordToObject(resp.rows[0]));
      });
  }

  /*
  queryOne methods
  getOneByQuery(filter), upsertQueryOne(filter), removeQueryOne(filter)
  these three are how you do crud if you have individual items that aren't tracked by id, say open_period, where
  items are identified by a unique moduleId, or say other collections that would use our autoIncrementFields
  to track items instead of id
   */
  getOneByQuery(filter) {
    return this.getMany(filter)
      .then(objs => {
        if (objs.length > 1) {
          throw new ApiError('Multiple rows returned from getOne query', null, 400);
        }
        return objs[0];
      });
  }

  upsertQueryOne(filter, obj, userId) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('upsertQueryOne called with no filter', null, 400);
    }
    return this.getMany(filter)
      .then(docs => {
        if (docs.length > 1) {
          throw new ApiError('upsertQueryOne refers to more than one item.', null, 400);
        }
        if (!docs.length) {
          return this.addOne(obj, userId);
        } else {
          return this.updateQueryOne(filter, obj, userId);
        }
      });
  }

  removeQueryOne(filter) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('removeQueryOne called with no filter', null, 400);
    }
    return this.getMany(filter)
      .then(items => {
        if (items.length > 1) {
          throw new ApiError('removeQueryOne multiple items.', null, 400);
        } else if (!items.length) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        let sql = `delete from ${this.table} `;
        const keys = Object.keys(filter);
        sql += this.buildParameterizedWhereClause(keys, 0, true);
        sql += ' returning *'
        return pgc.pgdb.query(sql, this.getFilterValues(keys, filter))
          .then(resp => this.orm.recordToObject(resp.rows[0]));
      });
  }

  /*
  sync methods:
  these allow multiple ways to sync records in a table with a set being sent up. Can be the whole table
  or a subset specified in the filter method. Can be done via delete all, then insert all, or by id or query
   */
  getSyncArrays(filter, uniqueFilterProps, records, userId) {
    let updates = [], adds = [], deletes = [];
    const predicate = this.createPredicateFromProperties(uniqueFilterProps);
    return this.getMany(filter)
      .then(docs => {
        updates = _.intersectionWith(records, docs, predicate);
        adds = _.differenceWith(records, docs, predicate);
        deletes = _.differenceWith(docs, records, predicate);

/*
        console.log('updates', updates);
        console.log('adds', adds);
        console.log('deletes', deletes);
*/

        return {updates, adds, deletes};
      });
  }

  // use this if you have an id column
  syncRecordsById(filter, records, userId) {
    return this.getSyncArrays(filter, [this.idProp], records, userId)
      .then(({updates, adds, deletes}) => {
        const promiseArr = [];
        updates.forEach(record => promiseArr.push(this.updateOneById(record, userId, true)));
        promiseArr.push(this.addMany(adds, userId));
        const deleteIds = deletes.map(obj => obj[this.idProp]);
        promiseArr.push(this.removeManyByIds(deleteIds));
        return Promise.all(promiseArr);
      });
  }

  // sync using uniqueFilterProps to identify records (instead of id)
  syncRecordsQueryOne(filter, uniqueFilterProps, records, userId, concurrencyCheck = true) {
    return this.getSyncArrays(filter, uniqueFilterProps, records, userId)
      .then(({updates, adds, deletes}) => {
        const promiseArr = [];
        updates.forEach(record => {
          const uniqueFilter = {};
          uniqueFilterProps.forEach(prop => uniqueFilter[prop] = record[prop]);
          // console.log('update', uniqueFilter);
          promiseArr.push(this.updateQueryOne(uniqueFilter, record, userId, concurrencyCheck));
        });
        promiseArr.push(this.addMany(adds, userId));
        deletes.forEach(record => {
          const uniqueFilter = {};
          uniqueFilterProps.forEach(prop => uniqueFilter[prop] = record[prop]);
          // console.log('delete', uniqueFilter);
          promiseArr.push(this.removeQueryOne(uniqueFilter));
        });
        return Promise.all(promiseArr);
      });
  }

  // use this if you don't have an id column or uniqueFilterProps can just delete all (in filter section)
  // and replace
  syncRecordsReplaceAll(filter, records, userId) {
    return this.removeMany(filter, false)
      .then(() => this.addMany(records, userId));
  }

  getFilterValues(keys, filter) {
    // need the same keys as buildParameterizedWhereClause to maintain the same order
    // so pass the same set in
    return keys.map(key => this.orm.getPgValue(key, null, filter[key]));
  }

  buildIdsWhereClause(ids) {
    if (!ids.length) {
      throw new ApiError('No ids for buildIdsWhereClause');
    }
    const sql = ` where ${this.orm.getPgField(this.idProp)} in (${ids.join(', ')}) `;
    return sql;
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

  addCreatedByAndUpdatedBy(item, userId) {
    if (this.hasCreatedBy()) {
      if (!userId) {
        throw new ApiError('no userId for createdBy/updatedBy.');
      }
      const date = new Date();
      item.createdBy = userId;
      item.createdDate = date;
      item.updatedBy = userId;
      item.updatedDate = date;
    }
  }

  addUpdatedBy(item, userId) {
    if (this.hasCreatedBy()) {
      if (!userId) {
        throw new ApiError('no userId for createdBy/updatedBy.');
      }
      const date = new Date();
      if (!item.createdBy) {
        item.createdBy = userId;
      }
      if (!item.createdDate) {
        item.createdDate = date;
      }
      item.updatedBy = userId;
      item.updatedDate = date;
    }
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

  hasCreatedBy() {
    return this.orm.hasCreatedBy;
  }

  createPredicateFromProperties(props) {
    return function(a, b) {
      if (!props.length) {
        return false;
      }
      let bool = true;
      props.forEach(prop => bool = bool &&
        (a[prop] !== undefined && b[prop] !== undefined && a[prop] === b[prop]));
      return bool;
    };
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
