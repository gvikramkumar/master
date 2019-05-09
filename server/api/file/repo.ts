import {Schema, model, Model} from 'mongoose';
import _ from 'lodash';
import {svrUtil} from '../../lib/common/svr-util';
import {injectable} from 'inversify';

const schema = new Schema({
  length: Number,
  uploadDate: Date,
  filename: String,
  contentType: String,
  metadata: Object
}, {collection: 'fs.files'});
svrUtil.setSchemaAdditions(schema);

// this is for fs.files only (file info gets)
@injectable()
export default class FileRepo {
  Model: Model<any>;

  constructor() {
    this.Model = model('Files', schema);
  }

  getMetadataFilter(params) {
    const filter = {};
    _.forEach(params, (val, key) => filter['metadata.' + key] = val);
    return filter;
  }

  getMany(params) {
    const filter = this.getMetadataFilter(params);
    return this.Model.find(filter).exec();
  }

  getManyGroupLatest(params = {}, groupField) {
    const filter = {};
    _.forEach(params, (val, key) => filter['metadata.' + key] = val);
    return this.Model.aggregate([
      {$match: filter},
      {$sort: {uploadDate: -1}},
      {$group: {_id: '$metadata.' + groupField, id: {$first: '$_id'}}},
      {$project: {_id: '$id'}}
    ]).then(arr => {
      const ids = arr.map(obj => obj._id);
      return this.Model.find({_id: {$in: ids}}).sort({[groupField]: 1});
    });
  }

  getManyByIds(ids) {
    return this.Model.find({_id: {$in: ids}}).exec();
  }

  getOneById(id) {
    return this.Model.findById(id).exec()
      .then(x => x);
  }

  getOneLatest(params = {}) {
    const filter = this.getMetadataFilter(params);
    return this.Model.find(filter).sort({uploadDate: -1}).limit(1).exec()
      .then(arr => arr.length ? arr[0] : null);
  }

}

