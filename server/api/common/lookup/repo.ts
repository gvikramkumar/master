import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import * as _ from 'lodash';
import {ApiError} from '../../../lib/common/api-error';

const schema = new Schema(
  {
    key: {type: String, required: true},
    value: Schema.Types.Mixed
  },
  {collection: 'dfa_lookup'}
);

@injectable()
export default class LookupRepo {
Model: Model<any>;

  constructor() {
    this.Model = model('Lookup', schema);
  }

  getMany(keys: string[]) {
    return this.Model.find({key: {$in: keys}}).exec();
  }

  getValues(keys: string[]) {
    return this.getMany(keys)
      .then(docs => docs.map(doc => doc && doc.value));
  }

  // would rather have getValue, but controller needs to be able to error if nothing is found. Something
  // "could" be found and have an undefined value, so only way to know is to return the doc itself
  getDoc(key) {
    return this.Model.findOne({key}).exec();
  }

  // use this if you don't care if document is there or not
  getValue(key) {
    return this.Model.findOne({key}).exec()
      .then(doc => doc && doc.value);
  }

  // this is for upload data validation for entries with just text values (not objects),
  // we need them upper case and sorted by lodash
  getTextValuesSortedUpperCase(key) {
    return this.getDoc(key)
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
          throw new ApiError(`Lookup key already exists: ${data.key}`);
        }
      });
  }

  upsert(data) {
    return this.getDoc(data.key)
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
