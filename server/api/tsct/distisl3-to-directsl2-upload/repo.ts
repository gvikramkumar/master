import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    // TO-DO
    // below 3 columns names has to be changed once collection is ready for use
    driverSl2: {type: Number, required: true},
    sourceSl3: {type: String, enum: ['Direct SL2', 'Disti SL3'], required: true},
    externalTheater: {type: String, required: true},

    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_tsct_distysl3_to_distysl2_upld'}
);

@injectable()
export default class Distisl3ToDirectsl2UploadRepo extends RepoBase {
  constructor() {
    super(schema, 'Distisl3ToDirectsl2Upload');
  }

}
