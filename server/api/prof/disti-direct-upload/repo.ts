import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    groupId: {type: Number, required: true},
    nodeType: {type: String, enum: ['Direct SL2', 'Disti SL3'], required: true},
    salesFinanceHierarchy: {type: String, required: true},
    nodeCode: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_disti_to_direct_map_upld'}
);

@injectable()
export default class DistiDirectUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'DistiDirectUpload');
  }

}
