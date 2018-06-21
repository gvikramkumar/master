import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    submeasureName: {type: String, required: true},
    nodeValue: {type: String, required: true},
    glAccount: Number,
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_department_acc_map'}
);

@injectable()
export default class DeptUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'DeptUpload');
  }

}
