import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import * as _ from 'lodash';
import {ApiError} from '../../../lib/common/api-error';

const schema = new Schema(
  {
    key: {type: String, required: true},
    value: Schema.Types.Mixed
  },
  {collection: 'lookup'}
);

@injectable()
export default class LookupRepo {
Model: Model<any>;

  constructor() {
    this.Model = model('Lookup', schema);
  }

  getDoc(key) {
    return this.Model.findOne({key}).exec();
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
    return item.save();
  }

  update({key, value}) {
    return this.getDoc(key)
      .then(item => {
        if (!item) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        item.value = value;
        return item.save();
      });
  }

  remove(key) {
    return this.getDoc(key)
      .then(item => {
        if (!item) {
          throw new ApiError('Item not found, please refresh your data.', null, 400);
        }
        return item.remove()
          .then(() => item.value);
      });
  }

}
