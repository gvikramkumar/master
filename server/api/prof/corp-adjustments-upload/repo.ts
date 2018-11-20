import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    actualSl2Code: {type: String, required: true},
    corpAdjustmentsCode: {type: String, required: true},
    alternateCountryName: String,
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_scms_triang_corpadj_map_upld'}
);

@injectable()
export default class CorpAdjustmentsUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'CorpAdjustmentsUpload');
  }

}
