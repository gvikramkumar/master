import mg, {Model, Schema} from 'mongoose';
import {NamedApiError} from '../common/named-api-error';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import {ApiError} from '../common/api-error';
import AnyObj from '../../../shared/models/any-obj';
import {mgc} from '../database/mongoose-conn';

export default class RepoBase {
  protected Model: Model<any>;
  protected autoIncrementField: string;
  protected secondAutoIncrementField: string;
  isModuleRepo = false;

  constructor(public schema: Schema, public modelName: string) {
    this.schema = schema;
    svrUtil.setSchemaAdditions(this.schema);
    this.Model = mg.model(modelName, schema);
  }

  getCount(filter = {}) {
    return this.Model.count(filter);
  }

  // get all that match filter, if yearmo/upperOnly exists, sets date constraints
  getMany(_filter: AnyObj = {}) {
    let filter = _.clone(_filter);
    this.verifyModuleId(filter);
    this.convertPropsToNumbers(filter);
    let query;
    const distinct = filter.getDistinct,
      limit = filter.setLimit,
      skip = filter.setSkip,
      sortBy = filter.setSort;
    filter = _.omit(filter, ['getDistinct', 'setLimit', 'setSkip', 'setSort']);
    filter = this.addDateRangeToFilter(filter);
    if (distinct) {
      // can't use limit with distinct.
      query = this.Model.distinct(distinct, filter);
    } else {
      query = this.Model.find(filter);
      if (skip) {
        query = query.skip(Number(skip));
      }
      if (limit) {
        query = query.limit(Number(limit));
      }
      if (sortBy) {
        query = query.sort(sortBy); // need to use string syntax: "name -updatedDate" so sortBy=name+-updatedDate
      }
    }
    return query.exec();
  }

  getManyActive(filter: AnyObj = {}) {
    filter.status = 'A';
    return this.getMany(filter);
  }

  getManyPending(filter: AnyObj = {}) {
    filter.status = 'P';
    return this.getMany(filter);
  }

  getManyByIds(ids) {
    return this.Model.find({_id: {$in: ids}}).exec();
  }

  // group by groupField and get latest or earliest of each group (updatedDateSort = 1: earliest, = -1: lastest)
  private getManyByGroupLatestOrEaliest(_filter: AnyObj = {}, updatedDateSort: number) {
    let filter = _.clone(_filter);
    this.convertPropsToNumbers(filter);
    this.verifyModuleId(filter);
    const groupField = filter.groupField;
    delete filter.groupField;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.aggregate([
      {$match: filter},
      {$sort: {updatedDate: updatedDateSort}},
      {$group: {_id: '$' + groupField, id: {$first: '$_id'}}},
      {$project: {_id: '$id'}}
    ])
      .then(arr => {
        const ids = arr.map(obj => obj._id);
        return this.Model.find({_id: {$in: ids}}).exec();
      });
  }

  getManyByGroupLatest(filter) {
    return this.getManyByGroupLatestOrEaliest(filter, -1);
  }

  getManyByGroupEarliest(filter) {
    return this.getManyByGroupLatestOrEaliest(filter, 1);
  }

  getManyLatestGroupByNameActive(moduleId, _filter = {}) {
    if (!moduleId) {
      throw new ApiError('getManyLatestGroupByNameActive: no moduleId');
    }
    const filter = Object.assign(_filter, {
      groupField: 'name',
      status: 'A',
      moduleId
    });
    return this.getManyByGroupLatest(filter);
  }

  getManyLatestGroupByNameInactive(moduleId, _filter = {}) {
    if (!moduleId) {
      throw new ApiError('getManyLatestGroupByNameInactive: no moduleId');
    }
    const filter = Object.assign(_filter, {
      groupField: 'name',
      status: 'I',
      moduleId
    });
    return this.getManyByGroupLatest(filter);
  }

  getManyEarliestGroupByNameActive(moduleId, _filter = {}) {
    if (!moduleId) {
      throw new ApiError('getManyEarliestGroupByNameActive: no moduleId');
    }
    const filter = Object.assign(_filter, {
      groupField: 'name',
      status: 'A',
      moduleId
    })
    return this.getManyByGroupEarliest(filter);
  }

  // get lastest active or inactive version, whichever is later
  getManyLatestByNameActiveInactive(moduleId, filter = {}) {
    if (!moduleId) {
      throw new ApiError('getManyLatestByNameActiveInactive: no moduleId');
    }
    return Promise.all([
      this.getManyLatestGroupByNameActive(moduleId, filter),
      this.getManyLatestGroupByNameInactive(moduleId, filter),
    ])
      .then(results => {
        const actives = results[0];
        const inactives = results[1];
        const names = _.uniq(actives.concat(inactives).map(x => x.name.toLowerCase()));
        const ailist = [];
        names.forEach(name => {
          // what we want is the lastest active, BUT... if there's a later inactive, or inactive and no active... then
          // we want the latest inactive, so they can make it active again if needed.
          const a = _.find(actives, x => x.name.toLowerCase() === name);
          const i = _.find(inactives, x => x.name.toLowerCase() === name);
          if (a && !i) {
            ailist.push(a);
          } else if (i && !a) {
            ailist.push(i);
          } else if (a.updatedDate >= i.updatedDate) {
            ailist.push(a);
          } else if (i.updatedDate > a.updatedDate) {
            ailist.push(i);
          }
        });
        return ailist;
      });

  }

  getOneById(id) {
    return this.Model.findById(id).exec();
  }

  // returns the latest value
  getOneLatest(_filter: AnyObj = {}) {
    let filter = _filter;
    this.verifyModuleId(filter);
    delete filter.getLatest;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.find(filter).sort({updatedDate: -1}).limit(1).exec()
      .then(arr => arr.length ? arr[0] : null);
  }

  getOneWithTimestamp(data) {
    const query = this.Model.findOne({_id: data.id});
    if (this.hasCreatedBy()) {
      query.where({updatedDate: data.updatedDate});
    }
    return query.exec()
      .then(item => {
        if (!item && data.updatedDate) {
          throw new NamedApiError('ConcurrencyError', 'Concurrency error, please refresh your data.', null, 400);
        } else if (!item) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        return item;
      });
  }

  addMany(docs, userId, bypassAutoInc = false, bypassCreatedUpdated = false) {
    if (!docs.length) {
      return Promise.resolve();
    }
    if (!bypassCreatedUpdated) {
      docs.forEach(doc => this.addCreatedByAndUpdatedBy(doc, userId));
    }
    let promise;
    if (this.autoIncrementField && !bypassAutoInc) {
      promise = this.getAutoIncrementValue()
        .then(inc => {
          docs.forEach(doc => {
            doc[this.autoIncrementField] = inc;
            if (this.secondAutoIncrementField) {
              doc[this.secondAutoIncrementField] = inc;
            }
            inc += 1;
          });
        });
    } else {
      promise = Promise.resolve();
    }
    return promise.then(() => this.Model.insertMany(docs));
  }

  // no autoincrement on this
  addManyTransaction(_docs, userId) {
    if (!_docs.length) {
      return Promise.resolve();
    }
    const transId = new mg.Types.ObjectId();
    const docs = _docs.map(doc => {
      doc.transactionId = transId;
      return doc;
    });
    return this.addMany(docs, userId)
      .catch(err => {
        if (err.result && err.result.nInserted > 0) {
          return this.Model.deleteMany({transactionId: transId})
            .then(() => Promise.reject(err));
        }
      });
  }

  addOne(data, userId, validate = true) {
    // if versioning items, our edits will actually be adds, so dump the ids in that case
    delete data._id;
    delete data.id;
    const item = new this.Model(data);
    this.addCreatedByAndUpdatedBy(item, userId);
    return this.fillAutoIncrementField(item)
      .then(() => item.save({validateBeforeSave: validate}));
  }

  // so far only diff is "don't bump up the autoIncrement field as we're updating and existing rule/submeasure
  copyOne(data, userId, validate = true) {
    // if versioning items, our edits will actually be adds, so dump the ids in that case
    delete data._id;
    delete data.id;
    const item = new this.Model(data);
    this.addCreatedByAndUpdatedBy(item, userId);
    return item.save({validateBeforeSave: validate});
  }

  // update via $set commands
  updateMany(filter, setObj) {
    this.verifyModuleId(filter);
    return this.Model.updateMany(filter, setObj).exec();
  }

  update(data, userId, concurrencyCheck = true, validate = true, addUpdatedBy = true) {
    let promise: Promise<any>;
    if (concurrencyCheck) {
      promise = this.getOneWithTimestamp(data);
    } else {
      promise = this.getOneById(data.id);
    }
    return promise
      .then(item => {
        if (!item) {
          throw new ApiError(`Measure doesn't exist.`);
        }
        if (addUpdatedBy) {
          this.addUpdatedBy(data, userId);
        }
        if (validate) {
          this.validate(data);
        }
        // we're not using doc.save() cause it won't update arrays or mixed types without doc.markModified(path)
        // we'll just replace the doc in entirety and be done with it
        return this.Model.replaceOne({_id: data.id}, data)
          .then(results => {
            if (results.nModified !== 1) {
              throw new ApiError('Failed to update document', data);
            }
            return data;
          });

      });
  }

  removeMany(filter) {
    if (!filter) {
      throw new ApiError('No filter for removeMany');
    }
    return this.Model.deleteMany(filter).exec();
  }

  remove(id) {
    return this.getOneById(id)
      .then(item => {
        if (!item) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        return item.remove();
      });
  }

  /*
  queryOne methods
  getOneByQuery(filter), upsertQueryOne(filter), removeQueryOne(filter)
  these three are how you do crud if you have individual items that aren't tracked by id, say open_period, where
  items are identified by a unique moduleId, or say other collections that would use our autoIncrementFields
  to track items instead of id
   */
  getOneByQuery(_filter = {}) {
    let filter = _filter;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.findOne(filter).exec();
  }

  upsertQueryOne(filter, data, userId, concurrencyCheck = true, cleanDuplicates = false) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('upsertQueryOne called with no filter', null, 400);
    }
    return this.getOneByQuery(filter)
      .then(doc => {
        if (!doc) {
          return this.addOne(data, userId);
        } else {
          return this.updateQueryOne(filter, data, userId, concurrencyCheck, cleanDuplicates);
        }
      });
  }

  updateQueryOne(filter, data, userId, concurrencyCheck = true, cleanDuplicates = false) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('updateQueryOne called with no filter', null, 400);
    }
    const query = this.Model.find(filter);
    if (data.updatedDate && concurrencyCheck) {
      query.where({updatedDate: data.updatedDate});
    }
    return query.exec()
      .then(docs => {
        if (docs.length > 1 && !cleanDuplicates) {
          throw new ApiError('updateQueryOne refers to more than one item.', null, 400);
        } else if (!docs.length) {
          throw new ApiError('updateQueryOne item not found', null, 400);
        }

        let promise;
        if (docs.length > 1 && cleanDuplicates) {
          if (!this.hasUpdatedDate()) {
            throw new ApiError('cleanDuplicates used on repo with no updatedDate');
          }
          const latestId = _.sortBy(docs, 'updatedDate').reverse()[0].id;
          promise = this.Model.deleteMany({_id: {$ne: latestId}});
        } else {
          promise = Promise.resolve();
        }

        return promise.then(() => {
          this.addUpdatedBy(data, userId);
          this.validate(data);
          // we're not using doc.save() cause it won't update arrays or mixed types without doc.markModified(path)
          // we'll just replace the doc in entirety and be done with it
          return this.Model.replaceOne(filter, data)
            .then(results => data);
        });
      });
  }

  removeQueryOne(filter) {
    return this.getMany(filter)
      .then(items => {
        if (items.length > 1) {
          throw new ApiError('removeQueryOne multiple items.', null, 400);
        } else if (!items.length) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        return items[0].remove();
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
    return this.Model.find(filter)
      .then(docs => {
        docs = docs.map(doc => doc.toObject());
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
    return this.getSyncArrays(filter, ['id'], records, userId)
      .then(({updates, adds, deletes}) => {
        const promiseArr = [];
        updates.forEach(item => this.addUpdatedBy(item, userId));
        updates.forEach(record => promiseArr.push(this.update(record, userId, false)));
        promiseArr.push(this.addMany(adds, userId));
        const deleteIds = deletes.map(obj => obj.id);
        promiseArr.push(this.Model.deleteMany({_id: {$in: deleteIds}}).exec());
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
  syncRecordsReplaceAll(filter, records, userId, bypassAutoInc = false, bypassCreatedUpdated = false) {
    return this.removeMany(filter)
      .then(() => this.addMany(records, userId, bypassAutoInc, bypassCreatedUpdated));
  }

  // a way to validate using mongoose outside of save(). If errs, then throw errs
  validate(data) {
    const doc = new this.Model(data);
    const errs = doc.validateSync(data);
    if (errs) {
      throw errs;
    }
  }

  // adds a data range to the filter if setYearmo param, if upperOnly=true then only upper constraint
  addDateRangeToFilter(_filter) {
    let filter = _filter;
    if (filter.setYearmo) {
      const dates = svrUtil.getDateRangeFromFiscalYearMo(filter.setYearmo);
      const dateRange = {
        updatedDate: {
          $gte: dates.startDate,
          $lt: dates.endDate
        }
      };
      if (filter.upperOnly) {
        delete dateRange.updatedDate.$gte;
        delete filter.upperOnly;
      }

      filter = Object.assign(filter, dateRange);
      delete filter.setYearmo;
      delete filter.upperOnly;
    }
    return filter;
  }

  verifyModuleId(filter) {

    if (filter.moduleId && typeof filter.moduleId === 'string') {
      filter.moduleId = Number(filter.moduleId);
    }
    // we expect repo.isModuleRepo repo's to always specify a moduleId, they must specify moduleId = -1 to override
    if (this.isModuleRepo) {
      if (!filter.moduleId) {
        throw new ApiError(`${this.modelName} repo call is missing moduleId`, null, 400);
      } else if (filter.moduleId === -1) {
        delete filter.moduleId; // get all modules
      }
    } else {
      // they might accidently get sent on a non-isModuleRepo repo
      if (filter.moduleId === -1) {
        delete filter.moduleId;
      }
    }
  }

  addCreatedByAndUpdatedBy(item, userId) {
    if (this.hasCreatedBy()) {
      if (!userId) {
        throw new ApiError('no userId for createdBy/updatedBy.');
      }
      const date = new Date();
      // with our rule and submeasure versioning, we add instead of update, in this case, we don't want to
      // wipe out the created user or date
      if (!item.createdBy || item.createdBy === 'system') {
        item.createdBy = userId;
        item.createdDate = date;
      }
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
      if (!item.createdBy || item.createdBy === 'system') {
        item.createdBy = userId;
        item.createdDate = date;
      }
      item.updatedBy = userId;
      item.updatedDate = date;
    }
  }

  getAutoIncrementValue() {
    return this.Model.find({})
      .sort({[this.autoIncrementField]: -1}).limit(1).exec()
      .then(docs => {
        if (docs.length) {
          return docs[0][this.autoIncrementField] + 1;
        } else {
          return 1;
        }
      });
  }

  fillAutoIncrementField(item) {
    if (this.autoIncrementField) {
      return this.getAutoIncrementValue()
        .then(inc => {
          item[this.autoIncrementField] = inc;
          if (this.secondAutoIncrementField) {
            item[this.secondAutoIncrementField] = inc;
          }
        });
    } else {
      return Promise.resolve();
    }
  }

  hasCreatedBy() {
    return !!this.schema.path('createdBy');
  }

  hasUpdatedDate() {
    return !!this.schema.path('updatedDate');
  }

  hasFiscalMonth() {
    return !!this.schema.path('fiscalMonth');
  }

  createPredicateFromProperties(props) {
    return function (a, b) {
      if (!props.length) {
        return false;
      }
      let bool = true;
      props.forEach(prop => bool = bool &&
        (a[prop] !== undefined && b[prop] !== undefined && a[prop] === b[prop]));
      return bool;
    };
  }

  convertPropsToNumbers(filter) {
    const props = ['moduleId', 'measureId', 'sourceId', 'submeasureId', 'submeasureKey', 'fiscalMonth'];
    props.forEach(prop => {
      const filterProp = filter[prop];
      // this prop can be: {$ne: 99}, so have to make sure it's a string or number
      // we shouldn't need this with mongoose, but are having issues either in reports or pgsync so started doing this
      // maybe could replace === with == to get around it? Would have to investigate the use case
      if (filterProp !== undefined && filterProp !== null && (typeof filterProp === 'string' || typeof filterProp === 'number')) {
        const val = Number(filterProp);
        if (isNaN(val)) {
          throw new ApiError(`convertPropsToNumbers: isNaN ${prop}: ${filterProp}`);
        }
        filter[prop] = val;
      }
    });
  }

}

