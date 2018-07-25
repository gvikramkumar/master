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

  constructor(public schema: Schema, protected modelName: string, protected isModuleRepo = false) {
    this.schema = schema;
    svrUtil.setSchemaAdditions(this.schema);
    this.Model = mg.model(modelName, schema);
  }

  // get all that match filter, if yearmo/upperOnly exists, sets date constraints
  getMany(_filter: AnyObj = {}) {
    let filter = _.clone(_filter);
    this.verifyModuleId(filter);
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

  getManyByIds(ids) {
    return this.Model.find({_id: {$in: ids}}).exec();
  }

  // group by groupField and get latest of each group
  getManyByGroupLatest(_filter: AnyObj = {}) {
    let filter = _filter;
    this.verifyModuleId(filter);
    const groupField = filter.groupField;
    delete filter.groupField;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.aggregate([
      {$match: filter},
      {$sort: {updatedDate: -1}},
      {$group: {_id: '$' + groupField, id: {$first: '$_id'}}},
      {$project: {_id: '$id'}}
    ])
      .then(arr => {
        const ids = arr.map(obj => obj._id);
        return this.Model.find({_id: {$in: ids}}).exec();
      });
  }

  getOneById(id) {
    return this.Model.findById(id).exec()
      .then(x => x);
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

  getOne(_filter = {}) {
    let filter = _filter;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.findOne(filter).exec();
  }

  getOneWithTimestamp(data) {
    const query = this.Model.findOne({_id: data.id});
    if (data.updatedDate) {
      query.where({updatedDate: data.updatedDate});
    }
    return query.exec()
      .then(item => {
        if (!item && data.updatedDate) {
          throw new NamedApiError('ConcurrencyError', 'Concurrency error, please refresh your data.', null, 400);
        }
        else if (!item) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        return item;
      });
  }

  // no autoincrement on this
  addMany(docs, userId) {
    let createdBy = false;
    let updatedBy = false;
    const date = new Date();
    if (this.schema.path('createdBy')) {
      createdBy = true;
    }
    if (this.schema.path('updatedBy')) {
      updatedBy = true;
    }
    docs.map(doc => {
      if (createdBy) {
        doc.createdBy = userId;
        doc.createdDate = date;
      }
      if (updatedBy) {
        doc.updatedBy = userId;
        doc.updatedDate = date;
      }
    });
    return this.Model.insertMany(docs);
  }

  // no autoincrement on this
  addManyTransaction(_docs, userId) {
    const transId = new mg.Types.ObjectId();
    const docs = _docs.map(doc => {
      doc.transactionId = transId;
      return doc;
    })
    return this.addMany(docs, userId)
      .catch(err => {
        if (err.result && err.result.nInserted > 0) {
          return this.Model.deleteMany({transactionId: transId})
            .then(() => Promise.reject(err))
        }
      })
  }

  addOne(data, userId) {
    // if versioning items, our edits will actually be adds, so dump the ids in that case
    delete data._id;
    delete data.id;
    const item = new this.Model(data);
    const date = new Date();
    if (this.schema.path('createdBy')) {
      item.createdBy = userId;
      item.createdDate = date;
    }
    if (this.schema.path('updatedBy')) {
      item.updatedBy = userId;
      item.updatedDate = date;
    }
    if (this.autoIncrementField) {
      return this.Model.find({})
        .sort({[this.autoIncrementField]: -1}).limit(1).exec()
        .then(docs => {
          if (docs.length) {
            item[this.autoIncrementField] = docs[0][this.autoIncrementField] + 1;
          } else {
            item[this.autoIncrementField] = 1;
          }
          return item.save();
        });
    } else {
      return item.save();
    }
  }

  /*
  getMany(filter), upsertQueryOne(filter), removeQueryOne(filter)
  these three are how you do crud if you have individual items that aren't tracked by id, say open_period.
  In this table we need one entry per module, so filter is: {moduleId: xxx}, then we can
  getMany, upsertQueryOne, and delete using this filter.
   */
  upsertQueryOne(filter, data, userId) {
    if (Object.keys(filter).length === 0) {
      throw new ApiError('upsertQueryOne called with no filter', null, 400);
    }
    return this.getMany(filter)
      .then(docs => {
        if (docs.length > 1) {
          throw new ApiError('upsertQueryOne refers to more than one item.', null, 400);
        }
        if (!docs.length) {
          return this.addOne(data, userId);
        } else {
          return this.update(data, userId, false);
        }
      });
  }

  update(data, userId, concurrencyCheck = true) {
    let promise: Promise<any>;
    if (concurrencyCheck) {
      promise = this.getOneWithTimestamp(data);
    } else {
      promise = this.getOneById(data.id);
    }
    return promise
      .then(item => {
        if (this.schema.path('updatedBy')) {
          data.updatedBy = userId;
          data.updatedDate = new Date();
        }
        this.validate(data);
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

  remove(id) {
    return this.getOneById(id)
      .then(item => {
        if (!item) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        return item.remove();
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
      }
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
    if (this.isModuleRepo) {
      if (!filter.moduleId) {
        throw new ApiError(`${this.modelName} repo call is missing moduleId`, null, 400);
      } else {
        filter.moduleId = Number(filter.moduleId);
      }
    }
  }

}

