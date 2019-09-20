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
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_swalloc_manualmix_upld'}
);

@injectable()
export default class ProductClassUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'ProductClassUpload');
  }

}
