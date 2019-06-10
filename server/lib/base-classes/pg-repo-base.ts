import AnyObj from '../../../shared/models/any-obj';
import {Orm, OrmMap} from './Orm';
import {pgc} from '../database/postgres-conn';
import {ApiError} from '../common/api-error';
import _ from 'lodash';

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
          throw new ApiError('Multiple rows returned from getOne query.', null, 400);
        }
        return objs[0];
      });
  }

  getId(data) {
    return data[this.idProp];
  }

  // this is NOT paremeterized, no way around that, as we have to upload 5k at a time
  addMany(objs, userId, bypassCreatedUpdated?) {
    if (!objs.length) {
      return Promise.resolve({rowCount: 0});
    }
    let sql = ` insert into ${this.table} ( `;
    sql += this.orm.mapsToPg.map(map => map.field).join(', ') + ' )\n values ';
    const arrSql = [];
    objs.forEach(obj => {
      const record = this.orm.objectToRecordAdd(obj, userId, bypassCreatedUpdated);
      const str = ' ( ' + this.orm.mapsToPg.map(map => this.orm.quote(record[map.field])).join(', ') + ' ) ';
      arrSql.push(str);
    })
    sql += arrSql.join(',\n');
    return pgc.pgdb.query(sql)
      .then(resp => ({rowCount: resp.rowCount}));
  }

  addOne(obj, userId) {
    const record = this.orm.objectToRecordAdd(obj, userId);
    let sql = ` insert into ${this.table} ( `;
    sql += this.orm.mapsToPg.map(map => map.field).join(', ') + ' ) values ( ';
    sql += this.orm.mapsToPg.map((map, idx) => `$${idx + 1}`).join(', ');
    sql += ' ) returning *';
    return pgc.pgdb.query(sql, this.orm.mapsToPg.map(map => record[map.field]))
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
  updateQueryOne(filter, obj, userId, concurrencyCheck = true, bypassCreatedUpdated = false) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('updateQueryOne called with no filter.', null, 400);
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
        if (!bypassCreatedUpdated) {
          this.addUpdatedBy(obj, userId);
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
          this.orm.maps.map(map => this.orm.getPgValue(null, map.field, record[map.field]))
            .concat(this.getFilterValues(keys, filter)))
          .then(resp => this.orm.recordToObject(resp.rows[0]));
      });
  }

  updateQueryOneNoCheck(filter, obj, userId, bypassCreatedUpdated = false) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('updateQueryOne called with no filter.', null, 400);
    }
    if (!bypassCreatedUpdated) {
      this.addUpdatedBy(obj, userId);
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
      this.orm.maps.map(map => this.orm.getPgValue(null, map.field, record[map.field]))
        .concat(this.getFilterValues(keys, filter)))
      .then(resp => this.orm.recordToObject(resp.rows[0]));
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
          throw new ApiError('Multiple rows returned from getOne query.', null, 400);
        }
        return objs[0];
      });
  }

  upsertQueryOne(filter, obj, userId) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('upsertQueryOne called with no filter.', null, 400);
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

  removeQueryOne(filter, concurrencyCheck = true) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('removeQueryOne called with no filter.', null, 400);
    }
    return this.getMany(filter)
      .then(items => {
        if (items.length > 1) {
          throw new ApiError('removeQueryOne multiple items.', null, 400);
        } else if (concurrencyCheck && !items.length) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        if (items.length) {
          let sql = `delete from ${this.table} `;
          const keys = Object.keys(filter);
          sql += this.buildParameterizedWhereClause(keys, 0, true);
          sql += ' returning *'
          return pgc.pgdb.query(sql, this.getFilterValues(keys, filter))
            .then(resp => this.orm.recordToObject(resp.rows[0]));
        }
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

  // sync using filter to section off and uniqueFilterProps to identify records in that section (instead of id)
  syncRecordsQueryOne(filter, uniqueFilterProps, records, userId, concurrencyCheck = true, bypassCreatedUpdated = false, remove = true) {
    return this.getSyncArrays(filter, uniqueFilterProps, records, userId)
      .then(({updates, adds, deletes}) => {
        const promiseArr = [];
        updates.forEach(record => {
          const uniqueFilter = {};
          uniqueFilterProps.forEach(prop => uniqueFilter[prop] = record[prop]);
          // console.log('update', uniqueFilter);
          // we're looking at a subset possibly, say fiscalMonth=201905, we need to add that to the uniqueFilter then
          const fullFilter = Object.assign({}, filter, uniqueFilter);
          promiseArr.push(this.updateQueryOne(fullFilter, record, userId, concurrencyCheck, bypassCreatedUpdated));
        });
        promiseArr.push(this.addMany(adds, userId, bypassCreatedUpdated));

        // for uploads that rollover we have "all" data in pg, and only insert/updates in partial uploads in mongo
        // for a given fiscalmonth. In that case we don't really "sync" we insert/update (no deletes)
        if (remove) {
          deletes.forEach(record => {
            const uniqueFilter = {};
            uniqueFilterProps.forEach(prop => uniqueFilter[prop] = record[prop]);
            // console.log('delete', uniqueFilter);
            // we're looking at a subset possibly, say fiscalMonth=201905, we need to add that to the uniqueFilter then
            const fullFilter = Object.assign({}, filter, uniqueFilter);
            promiseArr.push(this.removeQueryOne(fullFilter));
          });
        }

        return Promise.all(promiseArr);
      });
  }

  // NOT USED CURRENTLY, BUT KEEP AROUND.
  // The sync delete properties for rollover tables ended up NOT being unique records, getSyncArrays expects, that so went another route
  syncRecordsQueryOneDeleteInsertNoChecks(filter, uniqueFilterProps, records, userId, bypassCreatedUpdated = false, remove = true) {
    return this.getSyncArrays(filter, uniqueFilterProps, records, userId)
      .then(({updates, adds, deletes}) => {
        const deleteArr = [];
        updates.forEach(record => {
          const uniqueFilter = {};
          uniqueFilterProps.forEach(prop => uniqueFilter[prop] = record[prop]);
          const fullFilter = Object.assign({}, filter, uniqueFilter);
          deleteArr.push(this.removeMany(fullFilter));
        });

        // for uploads that rollover we have "all" data in pg, and only insert/updates in partial uploads in mongo
        // for a given fiscalmonth. In that case we don't really "sync" we insert/update (no deletes)
        if (remove) {
          deletes.forEach(record => {
            const uniqueFilter = {};
            uniqueFilterProps.forEach(prop => uniqueFilter[prop] = record[prop]);
            // console.log('delete', uniqueFilter);
            const fullFilter = Object.assign({}, filter, uniqueFilter);
            deleteArr.push(this.removeMany(fullFilter));
          });
        }

        return Promise.all(deleteArr)
          .then(() => this.addMany(adds.concat(updates), userId, bypassCreatedUpdated))
          .then(() => ({recordCount: records.length}));
      });
  }

  // use this if you don't have an id column or uniqueFilterProps can just delete all (in filter section)
  // and replace
  syncRecordsReplaceAll(filter, records, userId, bypassCreatedUpdated?) {
    return this.removeMany(filter, false)
      .then(() => this.addMany(records, userId, bypassCreatedUpdated))
      .then(() => ({recordCount: records.length}));
  }

  syncRecordsReplaceAllWhere(removeWhere, records, userId, bypassCreatedUpdated?) {
    let promise = Promise.resolve();
    // we have "where in (x,y,z)" where clauses that may not have any values, in that case we pass in undefined,
    // so have to bypass the delete then as a delete with empty parenthesis throws an error
    if (removeWhere) {
      // if they pass in an "in ()" where clause with no values in parenthesis, it will cause a postgres error,
      // they need to pass in undefined in that case instead
      if (/ in \(\)/.test(removeWhere)) {
        throw new ApiError(`repoBase.syncRecordsReplaceAllWhere: "in ()" where clause with no values`);
      }
      const sql = `delete from ${this.table} where ${removeWhere}`;
      promise = pgc.pgdb.query(sql);
    }
    return promise
      .then(() => this.addMany(records, userId, bypassCreatedUpdated))
      .then(() => ({recordCount: records.length}));
  }



  syncRecordsReplaceAllWhereProps(filter, props, records, userId, bypassCreatedUpdated?) {
    const deletes = [];
    const duplicates = _.uniqWith(records, this.createPredicateFromProperties(props))
      .map(x => Object.assign({}, filter, _.pick(x, props)))
      .forEach(x => deletes.push(this.removeMany(x)));

    return Promise.all(deletes)
      .then(() => this.addMany(records, userId, bypassCreatedUpdated))
      .then(() => ({recordCount: records.length}));
  }

  // works with buildParameterizedWhereClause to get parameter values
  getFilterValues(keys, filter) {
    // need the same keys as buildParameterizedWhereClause to maintain the same order
    // so pass the same set in
    return keys.map(key => {
      const val = this.orm.getPgValue(key, null, filter[key]);
      // we'll convert where clause with upper() if string and if string here... upper as well, to make
      // case insensitive filters
      return typeof val === 'string' ? val.toUpperCase() : val;
    });
  }

  buildIdsWhereClause(ids) {
    if (!ids.length) {
      throw new ApiError('No ids for buildIdsWhereClause.');
    }
    const sql = ` where ${this.orm.getPgField(this.idProp)} in (${ids.join(', ')}) `;
    return sql;
  }

  buildParameterizedWhereClause(keys, startIndex, errorIfEmpty) {
    let sql = '';
    if (keys.length) {
      sql += ' where ';
      keys.forEach((key, idx) => {
        let operator = ' = ';
        if (key.indexOf('$ne$') !== -1) { // not equal properties will end in $ne$ else will be "="
          operator = ' <> ';
          key = key.substr(0, key.length - 4);
          keys[idx] = key; // clean off $ne$ or won't find in orm map
        }
        const map = _.find(this.orm.maps, {prop: key});
        if (!map) {
          throw new ApiError(`No property found in ormMap for ${key}.`, null, 400);
        }
        const field = map.field;
        if (idx !== 0) {
          sql += ' and ';
        }
        if (map.type) { // numbers and dates
          sql += ` ${field} ${operator} $${startIndex + idx + 1} `;
        } else { // assume string
          sql += ` upper(${field}) ${operator} $${startIndex + idx + 1} `;
        }
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
        throw new ApiError(`${this.table} repo call is missing moduleId.`, null, 400);
      } else if (filter.moduleId === -1) {
        delete filter.moduleId; // get all modules
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
      props.forEach(prop => {
/*
        console.log(prop, a[prop], b[prop], bool, typeof a[prop] === 'string' && typeof b[prop] === 'string',
          (typeof a[prop] === 'string' && typeof b[prop] === 'string' ? a[prop].toUpperCase() === b[prop].toUpperCase() : a[prop] === b[prop]));
*/
        return bool = bool &&
          (a[prop] !== undefined && b[prop] !== undefined &&
            // assumes property exists and if string, compare case insensitive
            (typeof a[prop] === 'string' && typeof b[prop] === 'string' ? a[prop].toUpperCase() === b[prop].toUpperCase() : a[prop] === b[prop]));
      });
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
