import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import * as _ from 'lodash';
import {ApiError} from '../../../lib/common/api-error';

const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    key: {type: String, required: true},
    value: Schema.Types.Mixed
  },
  {collection: 'module_lookup'}
);

@injectable()
export default class ModuleLookupRepo {
Model: Model<any>;

  constructor() {
    this.Model = model('ModuleLookup', schema);
  }

  getMany(moduleId, keys: string[]) {
    return this.Model.find({moduleId, key: {$in: keys}}).exec();
  }

  getDoc(moduleId, key) {
    return this.Model.findOne({moduleId, key}).exec();
  }

  // this is for upload data validation for entries with just text values (not objects),
  // we need them upper case and sorted by lodash
  getTextValuesSortedUpperCase(moduleId, key) {
    return this.getDoc(moduleId, key)
      .then(doc => doc.value.map(val => val.toUpperCase()))
      .then(values => _.sortBy(values, _.identity));
  }

  add(data) {
    // if versioning items, our edits will actually be adds, so dump the ids in that case
    const item = new this.Model(data);
    return item.save()
      .then(doc => doc.value)
      .catch(err => {
        if (err.message.match(/duplicate/i)) {
          throw new ApiError(`Lookup key already exists for this moduleId/key: ${data.moduleId}/${data.key}`);
        }
      });
  }

  upsert(data) {
    return this.getDoc(data.moduleId, data.key)
      .then(item => {
        if (!item) {
          return this.add(data);
        }
        item.value = data.value;
        return item.save().then(doc => doc.value);
      });
  }

  remove(item) {
    return item.remove()
      .then(() => item.value);
  }

}
