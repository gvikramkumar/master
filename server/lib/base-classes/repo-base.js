const mg = require('mongoose'),
  NamedApiError = require('../common/named-api-error'),
  _ = require('lodash'),
  util = require('../common/util');

module.exports = class RepoBase {

  constructor(schema, modelName) {
    this.schema = schema;
    util.setSchemaAdditions(this.schema);
    this.Model = mg.model(modelName, schema);
  }

  // get all that match filter, if yearmo/upperOnly exists, sets date constraints
  getMany(_filter = {}) {
    let filter = _.clone(_filter);
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
  getManyByGroupLatest(_filter = {}) {
    let filter = _filter;
    const groupField = filter.groupField;
    delete filter.groupField;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.aggregate([
      {$match: filter},
      {$sort: {updatedDate: -1}},
      {$group: {_id: '$'+groupField, id: {$first: '$_id'}}},
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
  getOneLatest(_filter = {}) {
    let filter = _filter;
    delete filter.getLatest;
    filter = this.addDateRangeToFilter(filter);
    return this.Model.find(filter).sort({updatedDate: -1}).limit(1).exec()
      .then(arr => arr.length? arr[0]: null);
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
          const err = new NamedApiError('ConcurrencyError', 'Concurrency error, please refresh your data.', null, 400);
          throw(err);
        }
        else if (!item) {
          const err = new ApiError('Item not found, please refresh your data.', null, 400);
          throw(err);
        }
        return item;
      });
  }

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

  addManyTransaction(_docs, userId) {
    const transId = new mg.Types.ObjectId();
    const docs = _docs.map(doc => {
      doc.transactionId = transId;
      return doc;
    })
    return this.addMany(docs)
      .catch(err => {
        if (err.result.nInserted > 0) {
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
    return item.save();
  }

  update(data, userId) {
    return this.getOneWithTimestamp(data)
      .then(item => {
        _.merge(item, data);
        delete item._id;
        delete item.id;
        if (this.schema.path('updatedBy')) {
          item.updatedBy = userId;
          item.updatedDate = new Date();
        }
        return item.save()
      });
  }

  remove(id) {
    return this.getOneById(id)
      .then(item => {
      if (!item) {
          const err = new ApiError('Item not found, please refresh your data.', null, 400);
          throw(err);
        }
        return item.remove();
      });
  }

  // a way to validate early from the controller. Say your controller updates 2 things in database
  // and second one fails validation... could mess things up. In that case, validate both early in
  // controller to know beforehand. Also, mongoose update doesn't call validate, only save(), in that case,
  // you'll have to call it yourself.
  validate(data) {
    const item = new this.Model(data);
    return item.validateSync(data); // if(repo.validate(data)) >>  then have an error
  }

  // adds a data range to the filter if setYearmo param, if upperOnly=true then only upper constraint
  addDateRangeToFilter(_filter) {
    let filter = _filter;
    if (filter.setYearmo) {
      const dates = util.getDateRangeFromFiscalYearMo(filter.setYearmo);
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

}

