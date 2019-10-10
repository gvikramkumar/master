import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    driverSl2: {type: String, required: true},
    sourceSl3: {type: String, required: true},
    externalTheater: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_tsct_disti_to_direct_map_upld'}
);

@injectable()
export default class Distisl3ToDirectsl2UploadRepo extends RepoBase {
  constructor() {
    super(schema, 'Distisl3ToDirectsl2Upload');
  }

}
