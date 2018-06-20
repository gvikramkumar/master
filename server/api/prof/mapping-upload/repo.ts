import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    submeasureName: {type: String, required: true},
    product: String,
    sales: String,
    legalEntity: String,
    intBusinessEntity: String,
    scms: String,
    percentage: {type: Number, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_mapping_upload'}
);

@injectable()
export default class MappingUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'MappingUpload');
  }

}
