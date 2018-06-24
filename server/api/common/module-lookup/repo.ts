import {injectable} from 'inversify';
import {Schema, model, Model} from 'mongoose';
import * as _ from 'lodash';
import {ApiError} from '../../../lib/common/api-error';

const schema = new Schema(
  {
    type: String,
    values: []
  },
  {collection: 'module-lookup'}
);

@injectable()
export default class ModuleLookupRepo {
Model: Model<any>;

  constructor() {
    this.Model = model('ModuleLookup', schema);
  }

  getValuesByType(moduleId, type) {
    if (!moduleId) {
      throw new ApiError('Missing moduleId', null, 400);
    }
    return this.Model.findOne({moduleId, type}).exec()
      .then(doc => doc.values);
  }

  // this is for upload data validation for entries with just text values (not objects),
  // we need them upper case and sorted by lodash
  getTextValuesByTypeandSortedUpperCase(moduleId, type) {
    return this.getValuesByType(moduleId, type)
      .then(values => values.map(value => value.toUpperCase()))
      .then(values => _.sortBy(values, _.identity));
  }

}
