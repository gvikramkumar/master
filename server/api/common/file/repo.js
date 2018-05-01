const mg = require('mongoose'),
  ApiError = require('../../../lib/common/api-error'),
  _ = require('lodash');

const schema = mg.Schema({
  length: Number,
  uploadDate: String,
  filename: String,
  contentType: String,
  metadata: Object
}, {collection: 'fs.files'});
schema.set('toObject', {virtuals: true});
schema.virtual('id').get(function() {
  return this._id.toString();
});

// this is for fs.files only (file info gets)
module.exports = class FileRepo {

  constructor() {
    this.Model = mg.model('Files', schema);
  }

  // must have a directory, can also have type, limit, skip
  getMany(params = {}) {
    const obj = _.omit(params, ['skip', 'limit']);
    const filter = {};
    _.forEach(obj, (val, key) => filter['metadata.' + key] = val);
    const query = this.Model.find(filter);
    if (params.limit && params.skip !== undefined) {
      query.skip(Number(params.skip)).limit(Number(params.limit))
    }
    return query.exec();
  }

  getManyIds(ids, rq) {
    const query = this.Model.find({_id: {$in: ids}});
    if (rq.limit && rq.skip !== undefined) {
      query.skip(Number(rq.skip)).limit(Number(rq.limit))
    }
    return query.exec();
  }

  getOne(id) {
    return this.Model.findById(id).exec()
      .then(x => x);
  }

}

