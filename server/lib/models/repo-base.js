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

  getMany() {
    return this.Model.find().exec();
  }

  getOne(id) {
    return this.Model.findById(id).exec()
      .then(x => x);
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

  add(data, userId) {
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
    return this.getOne(id)
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

}

