import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    submeasureName: {type: String, required: true},
    splitCategory: {type: String, required: true},
    splitPercentage: {type: Number, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_swalloc_manual_mix'}
);

@injectable()
export default class ProductClassUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'ProductClassUpload');
  }

}
