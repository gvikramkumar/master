import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import _ from 'lodash';
import {ApiError} from '../../lib/common/api-error';
import {dfaJobs} from '../run-job/controller';

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
      .then(docs => {
        // these can come in any order, so reorder by keys
        return keys.map(key => {
          const doc = _.find(docs, {key});
          return doc && doc.value;
        });
      });
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
          throw new ApiError(`Lookup key already exists: ${data.key}.`);
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

  upsertMerge(data) {
    return this.getDoc(data.key)
      .then(item => {
        if (!item) {
          return this.add(data);
        }
        item.value = _.assign(item.value, data.value) ;
        return item.save().then(doc => doc.value);
      });
  }

  remove(item) {
    return item.remove()
      .then(() => item.value);
  }

  removeByKey(key) {
    return this.Model.remove({key})
      .setOptions({ single: true });
  }

  removeByKeys(keys) {
    return this.Model.remove({key: {$in: keys}});
  }

  getSyncingAndUploading() {
    return this.getValues(['syncing', 'uploading'])
      .then(values => {
        return {syncing: values[0], uploading: values[1]};
      });
  }

  setSyncing() {
    return this.upsert({
      key: 'syncing',
      value: _.get(global, 'dfa.serverUrl')
    });
  }

  setUploading() {
    return this.upsert({
      key: 'uploading',
      value: _.get(global, 'dfa.serverUrl')
    });
  }

  clearSyncing() {
    return this.removeByKey('syncing');
  }

  clearUploading() {
    return this.removeByKey('uploading');
  }

}
