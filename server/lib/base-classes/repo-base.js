const mg = require('mongoose'),
  ApiError = require('../common/api-error'),
  _ = require('lodash');

module.exports = class RepoBase {

  constructor(schema, modelName) {
    schema.add({timestamp: 'number'});
    schema.path('timestamp').required(true);
    schema.set('toObject', {virtuals: true});
    schema.virtual('id').get(function() {
      return this._id.toString();
    });
    this.Model = mg.model(modelName, schema);
  }

  getMany(limit, skip) {
    const query = this.Model.find();
    if (limit && skip !== undefined) {
      query.skip(Number(skip)).limit(Number(limit))
    }
    return query.exec();
  }

  getOne(id) {
    return this.Model.findById(id).exec()
      .then(x => x);
  }

  getOneWithTimestamp(data) {
    return this.Model.findOne({_id: data.id, timestamp: data.timestamp}).exec()
      .then(item => {
        if (!item) {
          const err = new ApiError('Concurrency error, please refresh your data.', null, 400);
          err.name = 'ConcurrencyError';
          throw(err);
        }
        return item;
      });
  }

  add(data, userName) {
    // if versioning items, our edits will actually be adds, so dump the ids in that case
    delete data._id;
    delete data.id;
    const item = new this.Model(data);
    item.createdBy = userName;
    item.createdDate = new Date().toISOString();
    item.updatedBy = userName;
    item.updatedDate = new Date().toISOString();
    item.timestamp = Date.now();
    return item.save();
  }

  update(data, userName) {
    return this.getOneWithTimestamp(data)
      .then(item => {
        _.merge(item, data);
        delete item._id;
        delete item.id;
        item.updatedBy = userName;
        item.updatedDate = new Date().toISOString();
        item.timestamp = Date.now();
        return item.save()
      });
  }

  remove(id) {
    return this.getOne(id)
      .then(item => item.remove());
  }

}

