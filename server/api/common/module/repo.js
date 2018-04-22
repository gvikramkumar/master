const mg = require('mongoose'),
  ApiError = require('../../../lib/api-error'),
  _ = require('lodash');

const schema = new mg.Schema(
  {
    name: {type: String, required: true}
  },
  {collection: 'modules'}
);
schema.set('toObject', { virtuals: true });
schema.virtual('id').get(function() {
  return this._id.toString();
});

const Model = mg.model('Module', schema);

function getMany(limit, skip) {
  const query = Model.find();
  if (limit && skip !== undefined) {
    query.skip(Number(skip)).limit(Number(limit))
  }
  return query.exec();
}

function getOne(id) {
  return Model.findById(id).exec()
    .then(x => x);
}

function getOneWithUpdatedDate(data) {
  const query = {_id: data.id};
  if (data.updatedDate) {
    query.updatedDate = data.updatedDate
  }
  return Model.findOne(query).exec()
    .then(item => {
      /*
      this is our concurrency check for update only
      1. no updatedDate sent up or in database, cool
      2. no updatedDate sent up, but one in database, fail
      3. updatedDate sent, then used in search, doesn't exist, fail // someone else updated or deleted it
       */
      if (!item || (item.updatedDate && !item.updatedDate)) {
        const err = new ApiError('Concurrency error, please refresh your data', null, 404);
        return Promise.reject(err);
      }
      return item;
    });
}

function add(data) {
  const item = new Model(data);
  return item.save();
}

function update(data) {
  return getOne(data)
    .then(item => {
      _.merge(item, data);
      delete item._id;
      delete item.id;
      return item.save()
    });
}

function remove(id) {
  return getOne(id)
    .then(item => item.remove());
}

module.exports = {getMany, getOne, add, update, remove};
